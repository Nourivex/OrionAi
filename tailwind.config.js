import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  safelist: [
    'bg-blueOcean-light', 'bg-blueOcean-dark', 'text-blueOcean-dark',
    'bg-win11-light', 'bg-win11-dark', 'text-win11-dark',
    'bg-kaliLinuxNight-light', 'bg-kaliLinuxNight-dark', 'text-kaliLinuxNight-dark',
    'bg-macOsSunny-light', 'bg-macOsSunny-dark', 'text-macOsSunny-dark',
    'bg-draculaPinkSoft-light', 'bg-draculaPinkSoft-dark', 'text-draculaPinkSoft-dark'
  ],
  theme: {
    extend: {
      colors: {
        // semantic theme tokens mapped to CSS variables (used at runtime)
        'theme-primary': 'var(--theme-primary)',
        'theme-primary-light': 'var(--theme-primary-light)',
        'theme-primary-dark': 'var(--theme-primary-dark)',
        'theme-accent': 'var(--theme-accent)',
        'theme-bg': 'var(--theme-bg)',
        'theme-text': 'var(--theme-text)',
        'theme-onPrimary': 'var(--theme-onPrimary)',

        blueOcean: {
          DEFAULT: '#0077B6',
          light: '#00B4D8',
          dark: '#03045E',
        },
        win11: {
          DEFAULT: '#2D89EF',
          light: '#5B9BD5',
          dark: '#1E4E8C',
        },
        kaliLinuxNight: {
          DEFAULT: '#0B1321',
          light: '#1A2436',
          dark: '#3B0F7A',
        },
        macOsSunny: {
          DEFAULT: '#FFD700',
          light: '#FFECB3',
          dark: '#FFC107',
        },
        draculaPinkSoft: {
          DEFAULT: '#FF79C6',
          light: '#FF92D0',
          dark: '#FF5EAB',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'sm-light': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'input': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'input-focus': '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'display': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
      }
    },
  },
  plugins: [
    typography,
    forms,
  ],
};
