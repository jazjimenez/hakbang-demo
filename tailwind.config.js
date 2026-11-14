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
        red: { DEFAULT: '#C8433A', tint: '#FBE9E7' },
        ink: '#15201A',
        muted: '#5E6B64',
        line: '#DDE5DF',
        paper: '#F6F8F4',
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
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
      boxShadow: { float: '0 8px 24px rgba(3,38,25,.12), 0 1px 3px rgba(3,38,25,.06)' },
    },
  },
  plugins: [],
};
