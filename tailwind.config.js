import plugin from 'tailwindcss/plugin'
import { cssColor, cssVariables, themeColors } from './src/theme/tokens.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(124, 92, 191, 0.25)',
        lift: '0 18px 45px -18px rgba(124, 92, 191, 0.35)',
        glow: '0 0 0 4px rgba(183, 156, 237, 0.35)'
      },
      backgroundImage: {
        brand: `linear-gradient(135deg, ${cssColor('blush-soft')} 0%, ${cssColor('lavender')} 55%, ${cssColor('violet')} 100%)`,
        'brand-soft': `linear-gradient(135deg, ${cssColor('blush-mist')} 0%, ${cssColor('lavender-mist')} 60%, ${cssColor('lavender-light')} 100%)`
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(0.7)' },
          '50%': { transform: 'scale(1)' }
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        fadeup: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        fadeup: 'fadeup 250ms ease-out both'
      }
    }
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': cssVariables('light'),
        '.dark': cssVariables('dark')
      })
    })
  ]
}
