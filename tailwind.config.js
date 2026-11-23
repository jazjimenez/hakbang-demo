/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: '#005D41',
        deep: '#023B2A',
        lime: '#5DB250',
        mint: '#E8F3EA',
        mango: { DEFAULT: '#E8912A', tint: '#FDF0DC', ink: '#94570C' },
        // red text darkened from #C8433A so it passes AA on the cream surfaces
        red: { DEFAULT: '#B0372F', tint: '#FBE9E7' },
        ink: '#15201A',
        muted: '#5E6B64',
        line: '#DCD5C3',
        paper: '#F3EFE5',
        cream: '#FBF8F1',
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        hero: ['64px', { lineHeight: '66px', letterSpacing: '-0.02em', fontWeight: '800' }],
        display: ['34px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h-l': ['26px', { lineHeight: '31px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h-m': ['20px', { lineHeight: '25px', letterSpacing: '-0.005em', fontWeight: '700' }],
        'h-s': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        stat: ['32px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '700' }],
        title: ['16px', { lineHeight: '22px', fontWeight: '600' }],
        body: ['15px', { lineHeight: '22px' }],
        'body-s': ['13px', { lineHeight: '18px' }],
        label: ['13px', { lineHeight: '16px', fontWeight: '600' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '500' }],
        button: ['16px', { lineHeight: '20px', fontWeight: '600' }],
      },
      borderRadius: { btn: '14px', input: '12px', card: '20px', panel: '24px', sheet: '28px' },
      boxShadow: {
        float: '0 8px 24px rgba(3,38,25,.12), 0 1px 3px rgba(3,38,25,.06)',
        // liquid glass: soft drop shadow plus an inner top highlight and a faint
        // light rim, so cards and buttons read as glass (see .hk-glass rules and
        // src/lib/liquidGlass.ts). The names are kept from the old hard "step" shadows.
        step: 'inset 0 1px 0 rgba(255,255,255,.32), inset 0 -3px 8px rgba(0,0,0,.18), 0 8px 18px -6px rgba(2,59,42,.55)',
        'step-ink': 'inset 0 1px 0 rgba(255,255,255,.9), inset 0 0 0 1px rgba(255,255,255,.4), 0 6px 16px -6px rgba(21,32,26,.28)',
        'step-lime': 'inset 0 1px 0 rgba(255,255,255,.9), inset 0 0 0 1px rgba(255,255,255,.4), 0 8px 22px -6px rgba(93,178,80,.6)',
        brut: 'inset 0 1px 0 rgba(255,255,255,.85), inset 0 0 0 1px rgba(255,255,255,.35), 0 14px 34px -10px rgba(2,59,42,.28), 0 2px 6px rgba(2,59,42,.08)',
        'brut-sm': 'inset 0 1px 0 rgba(255,255,255,.85), inset 0 0 0 1px rgba(255,255,255,.35), 0 10px 24px -8px rgba(2,59,42,.26), 0 1px 4px rgba(2,59,42,.08)',
        'brut-lime': 'inset 0 1px 0 rgba(255,255,255,.35), inset 0 0 0 1px rgba(255,255,255,.12), 0 16px 38px -10px rgba(93,178,80,.55), 0 2px 6px rgba(2,59,42,.12)',
        glass: 'inset 0 1px 0 rgba(255,255,255,.55), inset 0 -3px 8px rgba(2,59,42,.12), 0 8px 18px -6px rgba(2,59,42,.45)',
      },
    },
  },
  plugins: [],
};
