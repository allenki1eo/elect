import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#F8F9FC',
        surface: '#FFFFFF',
        'surface-2': '#F1F3F9',
        border: '#E2E5EF',
        accent: '#6C63FF',
        'accent-2': '#FF6584',
        gold: '#D4A012',
        silver: '#8E8E9A',
        bronze: '#CD7F32',
        'text-primary': '#1A1A2E',
        'text-muted': '#6B7094',
        success: '#16A07A',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'zoom-in-95': { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'zoom-out-95': { from: { opacity: '1', transform: 'scale(1)' }, to: { opacity: '0', transform: 'scale(0.95)' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'slide-in-from-left-1/2': { from: { transform: 'translateX(-50%) translateY(-48%)' }, to: { transform: 'translateX(-50%) translateY(-50%)' } },
        'slide-out-to-left-1/2': { from: { transform: 'translateX(-50%) translateY(-50%)' }, to: { transform: 'translateX(-50%) translateY(-48%)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
