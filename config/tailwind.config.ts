import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-electric': '#39FF14',
        'dark-900': '#121212',
        'dark-800': '#1E1E1E',
        'dark-600': '#333333',
        'dark-400': '#666666',
        'dark-300': '#E0E0E0',
        'status-success': '#22c55e',
        'status-error': '#ef4444',
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(57, 255, 20, 0.3)',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
        display: ['Teko', 'sans-serif'],
      },
    },
  },
  plugins: [
    (await import('@tailwindcss/forms')).default,
    (await import('@tailwindcss/typography')).default,
  ],
} satisfies Config;
