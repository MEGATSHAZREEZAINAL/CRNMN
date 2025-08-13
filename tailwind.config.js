/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // CORNMAN Brand Colors - Urban Streetwear Palette
      colors: {
        // Primary Brand Colors
        brand: {
          electric: '#39FF14', // Signature neon green
          'electric-dark': '#2ECC11',
          'electric-light': '#4DFF28',
        },

        // Dark Theme Palette
        dark: {
          950: '#0A0A0A', // Pure black backgrounds
          900: '#121212', // Main background
          850: '#1A1A1A', // Elevated surfaces
          800: '#1E1E1E', // Card backgrounds
          700: '#2A2A2A', // Interactive elements
          600: '#333333', // Borders/dividers
          500: '#4A4A4A', // Disabled states
          400: '#666666', // Secondary text
          300: '#888888', // Tertiary text
          200: '#AAAAAA', // Light text
          100: '#E0E0E0', // Primary text
          50: '#F5F5F5', // Brightest text
        },

        // Light Theme Palette (for future light mode)
        light: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#000000',
        },

        // Accent Colors - Streetwear Inspired
        accent: {
          orange: '#FF6B35', // Energy/Warning
          'orange-dark': '#E55A2B',
          yellow: '#FFD23F', // Attention/Success
          'yellow-dark': '#E5BD35',
          purple: '#8B5CF6', // Premium/VIP
          'purple-dark': '#7C3AED',
          cyan: '#06B6D4', // Info/Tech
          'cyan-dark': '#0891B2',
          red: '#EF4444', // Error/Danger
          'red-dark': '#DC2626',
        },

        // Status Colors
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#06B6D4',
        },

        // Social Media Brand Colors
        social: {
          facebook: '#1877F2',
          instagram: '#E4405F',
          tiktok: '#000000',
          twitter: '#1DA1F2',
          youtube: '#FF0000',
          whatsapp: '#25D366',
        },
      },

      // Typography System
      fontFamily: {
        display: ['Teko', 'Impact', 'Arial Black', 'sans-serif'],
        mono: ['Roboto Mono', 'Monaco', 'Consolas', 'monospace'],
        heading: ['Teko', 'Impact', 'sans-serif'],
        body: ['Roboto Mono', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display-xl': ['6rem', { lineHeight: '1', letterSpacing: '0.1em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '0.08em' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '0.06em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0.04em' }],
        'heading-xl': ['2rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],
        'heading-md': ['1.5rem', { lineHeight: '1.3' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4' }],
        'body-xl': ['1.125rem', { lineHeight: '1.6' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body-md': ['0.875rem', { lineHeight: '1.5' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5' }],
        caption: ['0.6875rem', { lineHeight: '1.4' }],
      },

      // Spacing System (based on 8px grid)
      spacing: {
        0.5: '0.125rem', // 2px
        1: '0.25rem', // 4px
        1.5: '0.375rem', // 6px
        2: '0.5rem', // 8px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        7: '1.75rem', // 28px
        8: '2rem', // 32px
        10: '2.5rem', // 40px
        12: '3rem', // 48px
        14: '3.5rem', // 56px
        16: '4rem', // 64px
        20: '5rem', // 80px
        24: '6rem', // 96px
        32: '8rem', // 128px
        40: '10rem', // 160px
        48: '12rem', // 192px
        56: '14rem', // 224px
        64: '16rem', // 256px
      },

      // Border Radius System
      borderRadius: {
        none: '0',
        xs: '0.125rem', // 2px
        sm: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
        '2xl': '1rem', // 16px
        '3xl': '1.5rem', // 24px
        full: '9999px',
      },

      // Box Shadow System
      boxShadow: {
        'glow-brand': '0 0 20px rgba(57, 255, 20, 0.3)',
        'glow-brand-intense': '0 0 30px rgba(57, 255, 20, 0.5)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'elevation-2': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0 8px 16px rgba(0, 0, 0, 0.3)',
        'elevation-4': '0 16px 32px rgba(0, 0, 0, 0.4)',
        'inner-glow': 'inset 0 0 10px rgba(57, 255, 20, 0.1)',
      },

      // Animation & Transitions
      transitionDuration: {
        50: '50ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        250: '250ms',
        300: '300ms',
        400: '400ms',
        500: '500ms',
        750: '750ms',
        1000: '1000ms',
      },

      // Custom Animations
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(57, 255, 20, 0.3)',
            borderColor: 'rgba(57, 255, 20, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.8)',
            borderColor: 'rgba(57, 255, 20, 0.8)',
          },
        },
        'slide-in-up': {
          '0%': {
            transform: 'translateY(100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'slide-in-left': {
          '0%': {
            transform: 'translateX(-100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      },

      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear',
      },

      // Background Gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #39FF14 0%, #2ECC11 100%)',
        'dark-gradient': 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
        'shimmer-gradient':
          'linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.1), transparent)',
        'hero-mesh':
          'radial-gradient(circle at 25% 25%, rgba(57, 255, 20, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(57, 255, 20, 0.05) 0%, transparent 50%)',
      },

      // Component-specific extensions
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [
    // Plugin for custom utilities
    function ({ addUtilities, theme }) {
      addUtilities({
        // Text Utilities
        '.text-brand-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.brand.electric')}, ${theme('colors.brand.electric-dark')})`,
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },

        // Glass morphism utilities
        '.glass': {
          'backdrop-filter': 'blur(8px)',
          background: 'rgba(30, 30, 30, 0.8)',
          border: `1px solid ${theme('colors.dark.600')}`,
        },

        '.glass-light': {
          'backdrop-filter': 'blur(8px)',
          background: 'rgba(30, 30, 30, 0.6)',
          border: `1px solid ${theme('colors.dark.600')}`,
        },

        // Brand button styles
        '.btn-brand': {
          background: theme('colors.brand.electric'),
          color: theme('colors.dark.900'),
          'font-family': theme('fontFamily.heading'),
          'font-weight': '700',
          'text-transform': 'uppercase',
          'letter-spacing': '0.05em',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: theme('colors.brand.electric-dark'),
            transform: 'scale(1.02)',
            'box-shadow': theme('boxShadow.glow-brand'),
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },

        // Card styles
        '.card-dark': {
          background: theme('colors.dark.800'),
          border: `1px solid ${theme('colors.dark.600')}`,
          'border-radius': theme('borderRadius.lg'),
        },

        '.card-glass': {
          'backdrop-filter': 'blur(8px)',
          background: 'rgba(30, 30, 30, 0.8)',
          border: `1px solid ${theme('colors.dark.600')}`,
          'border-radius': theme('borderRadius.lg'),
        },

        // Scroll styles
        '.scrollbar-brand': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.dark.700'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.brand.electric'),
            'border-radius': '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.brand.electric-dark'),
          },
        },
      });
    },
  ],
};
