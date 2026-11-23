/*
 * Liquid glass for elements that sit over the dark green sections.
 *
 * The refraction shader is ported from dashersw/liquid-glass-js (MIT,
 * https://github.com/dashersw/liquid-glass-js): edge/rim/base refraction along
 * the shape normal, a 13x13 gaussian blur, a tint gradient and a soft shape
 * mask. What changed for this site:
 *   - the backdrop is a snapshot of the element's own section
 *     ([data-glass-backdrop]), not the whole page, so textures stay small;
 *   - glass elements are ordinary React elements marked [data-glass], not
 *     elements the library creates; a canvas is slotted in behind content;
 *   - each live element needs its own WebGL context and browsers keep only
 *     ~16 alive, so at most MAX_LIVE are live at once (on screen first);
 *     everything else keeps the CSS glass in index.css;
 *   - it draws only when the element moves, not every frame;
 *   - the tint is per element (cream, lime or clear) so text stays readable.
 */

type Tint = 'cream' | 'lime' | 'clear';

const MAX_LIVE = 12;

// top and bottom tint colours, and how strongly to tint the middle (0-1).
// The tint fades out toward the rim, so refraction shows at the edges while
// the text area stays close to the solid colour (muted text keeps 4.5:1).
const TINTS: Record<Tint, { top: [number, number, number]; bottom: [number, number, number]; amount: number }> = {
  cream: { top: [0.99, 0.98, 0.95], bottom: [0.98, 0.968, 0.94], amount: 0.985 },
  lime: { top: [0.4, 0.73, 0.35], bottom: [0.365, 0.7, 0.315], amount: 0.995 },
  clear: { top: [1, 1, 1], bottom: [0.75, 0.8, 0.77], amount: 0.1 },
};

const VS = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_texcoord = a_texcoord;
}`;

const FS = `
precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_textureSize;
uniform vec2 u_containerPosition;
uniform float u_blurRadius;
uniform float u_borderRadius;
uniform float u_edgeIntensity;
uniform float u_rimIntensity;
uniform float u_edgeDistance;
uniform float u_rimDistance;
uniform float u_cornerBoost;
uniform float u_rippleEffect;
uniform float u_tintOpacity;
uniform vec3 u_tintTop;
uniform vec3 u_tintBottom;
varying vec2 v_texcoord;

float roundedRectDistance(vec2 coord, vec2 size, float radius) {
  vec2 center = size * 0.5;
  vec2 p = coord * size;
  vec2 toCorner = abs(p - center) - (center - radius);
  return length(max(toCorner, 0.0)) + min(max(toCorner.x, toCorner.y), 0.0) - radius;
}

void main() {
  vec2 coord = v_texcoord;
  vec2 size = u_resolution;
  vec2 pagePixel = u_containerPosition + (coord - 0.5) * size;
  vec2 textureCoord = pagePixel / u_textureSize;

  float d = max(-roundedRectDistance(coord, size, u_borderRadius), 0.0);
  vec2 normal = normalize(coord - 0.5 + 1e-5);

  float edge = exp(-d * u_edgeDistance);
  float rim = exp(-d * u_rimDistance);
  vec2 refraction = normal * (edge * u_edgeIntensity + rim * u_rimIntensity);

  float cornerDist = max(min(coord.x, 1.0 - coord.x), min(coord.y, 1.0 - coord.y)) * min(size.x, size.y);
  refraction += normal * exp(-cornerDist * 0.3) * u_cornerBoost;
  refraction += vec2(-normal.y, normal.x) * sin(d / min(size.x, size.y) * 25.0) * u_rippleEffect * rim;
  textureCoord += refraction;

  vec4 color = vec4(0.0);
  vec2 texel = 1.0 / u_textureSize;
  float sigma = u_blurRadius / 2.0;
  float total = 0.0;
  for (float i = -6.0; i <= 6.0; i += 1.0) {
    for (float j = -6.0; j <= 6.0; j += 1.0) {
      float dist = length(vec2(i, j));
      if (dist > 6.0) continue;
      float w = exp(-(dist * dist) / (2.0 * sigma * sigma));
      color += texture2D(u_image, textureCoord + vec2(i, j) * texel * sigma) * w;
      total += w;
    }
  }
  color /= total;

  vec3 tint = mix(u_tintTop, u_tintBottom, coord.y);
  vec3 rgb = mix(color.rgb, tint, u_tintOpacity * (1.0 - 0.75 * rim - 0.12 * edge));

  // specular sheen along the top edge, like the library's rim light
  rgb += vec3(1.0) * exp(-coord.y * size.y * 0.25) * 0.18;

  float mask = 1.0 - smoothstep(-1.0, 1.0, roundedRectDistance(coord, size, u_borderRadius));
  gl_FragColor = vec4(rgb * mask, mask);
}`;

type Live = {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  loc: Record<string, WebGLUniformLocation | null>;
  backdrop: HTMLElement;
  last: string;
};

const snapshots = new Map<HTMLElement, Promise<HTMLCanvasElement | null>>();
const live = new Map<HTMLElement, Live>();
const waiting = new Set<HTMLElement>();
let observer: IntersectionObserver | null = null;
let raf = 0;

function snapshot(backdrop: HTMLElement) {
  let p = snapshots.get(backdrop);
  if (!p) {
    p = import('html2canvas')
      .then(({ default: html2canvas }) =>
        html2canvas(backdrop, {
          scale: 1,
          backgroundColor: null,
          logging: false,
          useCORS: true,
          ignoreElements: (e) => e instanceof HTMLElement && (e.hasAttribute('data-glass') || e.classList.contains('hk-glass-canvas')),
        }),
      )
      .catch(() => null);
    snapshots.set(backdrop, p);
  }
  return p;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

async function activate(el: HTMLElement) {
  if (live.has(el) || live.size >= MAX_LIVE) return;
  const backdrop = el.closest<HTMLElement>('[data-glass-backdrop]');
  if (!backdrop) return;
  const shot = await snapshot(backdrop);
  if (!shot || !el.isConnected || live.has(el) || live.size >= MAX_LIVE || !waiting.has(el)) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hk-glass-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true });
  if (!gl) return;
  const vs = compile(gl, gl.VERTEX_SHADER, VS);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const quad = (name: string, data: number[]) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    const at = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  };
  quad('a_position', [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  quad('a_texcoord', [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, shot);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const names = ['u_image', 'u_resolution', 'u_textureSize', 'u_containerPosition', 'u_blurRadius', 'u_borderRadius', 'u_edgeIntensity', 'u_rimIntensity', 'u_edgeDistance', 'u_rimDistance', 'u_cornerBoost', 'u_rippleEffect', 'u_tintOpacity', 'u_tintTop', 'u_tintBottom'];
  const loc: Live['loc'] = {};
  names.forEach((n) => (loc[n] = gl.getUniformLocation(prog, n)));

  const tint = TINTS[(el.dataset.glass as Tint) in TINTS ? (el.dataset.glass as Tint) : 'cream'];
  gl.uniform1i(loc.u_image, 0);
  gl.uniform2f(loc.u_textureSize, shot.width, shot.height);
  // the library's defaults, with a slightly stronger rim so the bend reads at card size
  gl.uniform1f(loc.u_blurRadius, 5);
  gl.uniform1f(loc.u_edgeIntensity, 0.01);
  gl.uniform1f(loc.u_rimIntensity, 0.06);
  gl.uniform1f(loc.u_edgeDistance, 0.15);
  gl.uniform1f(loc.u_rimDistance, 0.8);
  gl.uniform1f(loc.u_cornerBoost, 0.02);
  gl.uniform1f(loc.u_rippleEffect, 0.1);
  gl.uniform1f(loc.u_tintOpacity, tint.amount);
  gl.uniform3f(loc.u_tintTop, ...tint.top);
  gl.uniform3f(loc.u_tintBottom, ...tint.bottom);
  gl.clearColor(0, 0, 0, 0);

  el.prepend(canvas);
  el.setAttribute('data-glass-live', '');
  live.set(el, { el, canvas, gl, loc, backdrop, last: '' });
  draw(live.get(el)!);
  loop();
}

function deactivate(el: HTMLElement) {
  const l = live.get(el);
  if (!l) return;
  l.gl.getExtension('WEBGL_lose_context')?.loseContext();
  l.canvas.remove();
  el.removeAttribute('data-glass-live');
  live.delete(el);
  // hand the free slot to the next element waiting on screen
  for (const w of waiting) if (!live.has(w)) { void activate(w); break; }
}

function draw(l: Live) {
  const r = l.el.getBoundingClientRect();
  const b = l.backdrop.getBoundingClientRect();
  const w = Math.max(1, Math.round(r.width));
  const h = Math.max(1, Math.round(r.height));
  const key = `${w}x${h}@${Math.round(r.left - b.left)},${Math.round(r.top - b.top)}`;
  if (key === l.last) return;
  l.last = key;
  const { gl, canvas, loc } = l;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
  const radius = Math.min(parseFloat(getComputedStyle(l.el).borderTopLeftRadius) || 0, w / 2, h / 2);
  gl.uniform2f(loc.u_resolution, w, h);
  gl.uniform1f(loc.u_borderRadius, radius);
  gl.uniform2f(loc.u_containerPosition, r.left - b.left + r.width / 2, r.top - b.top + r.height / 2);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// cheap per-frame check; a canvas redraws only when its element moved or resized
function loop() {
  if (raf) return;
  const tick = () => {
    live.forEach(draw);
    raf = live.size ? requestAnimationFrame(tick) : 0;
  };
  raf = requestAnimationFrame(tick);
}

/** Start glass on every [data-glass] element inside a [data-glass-backdrop] under root. Returns a cleanup. */
export function mountLiquidGlass(root: ParentNode = document): () => void {
  const reduced = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
  if (reduced || !document.createElement('canvas').getContext('webgl')) return () => {};

  observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) {
          waiting.add(el);
          void activate(el);
        } else {
          waiting.delete(el);
          deactivate(el);
        }
      }),
    { rootMargin: '120px' },
  );
  const els = [...root.querySelectorAll<HTMLElement>('[data-glass-backdrop] [data-glass]')];
  els.forEach((el) => observer!.observe(el));

  // a new layout (resize, fonts) can move the backdrop art: retake snapshots
  let t = 0;
  const onResize = () => {
    clearTimeout(t);
    t = window.setTimeout(() => {
      snapshots.clear();
      [...live.keys()].forEach((el) => {
        deactivate(el);
        waiting.add(el);
        void activate(el);
      });
    }, 300);
  };
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    clearTimeout(t);
    els.forEach((el) => {
      observer?.unobserve(el);
      waiting.delete(el);
      deactivate(el);
    });
    snapshots.clear();
  };
}
