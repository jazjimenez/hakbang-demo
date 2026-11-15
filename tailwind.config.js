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
        // "step" shadows: hard, offset, no blur — things sit on a ledge and press down
        step: '0 4px 0 0 #023B2A',
        'step-ink': '0 3px 0 0 #15201A',
        'step-lime': '0 4px 0 0 #5DB250',
        brut: '5px 5px 0 0 #15201A',
        'brut-sm': '3px 3px 0 0 #15201A',
        'brut-lime': '6px 6px 0 0 #5DB250',
      },
    },
  },
  plugins: [],
};
