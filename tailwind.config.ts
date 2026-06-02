import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        'surface-2': '#1E1E2A',
        border: '#2A2A3A',
        accent: '#6C63FF',
        'accent-2': '#FF6584',
        gold: '#F5C842',
        silver: '#C0C0D0',
        bronze: '#CD7F32',
        'text-primary': '#F0F0FF',
        'text-muted': '#8080A0',
        success: '#22D3A0',
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
