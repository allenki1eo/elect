import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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
    },
  },
  plugins: [],
} satisfies Config;
