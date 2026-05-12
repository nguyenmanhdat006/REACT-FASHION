/** @type {import('tailwindcss').Config} */
import { primary, secondary, accent, gray } from './src/constants/colors';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        gray: gray,
        primary: {
          ...primary,
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          ...secondary,
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          ...accent,
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'hsl(var(--ring))',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
    fontFamily: {
      sans: ['Poppins', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      'h1-regular': ['48px', { lineHeight: '58px', fontWeight: '400' }],
      'h1-medium': ['48px', { lineHeight: '58px', fontWeight: '500' }],
      'h1-semi': ['48px', { lineHeight: '58px', fontWeight: '600' }],
      'h1-bold': ['48px', { lineHeight: '58px', fontWeight: '700' }],

      'h2-regular': ['40px', { lineHeight: '50px', fontWeight: '400' }],
      'h2-medium': ['40px', { lineHeight: '50px', fontWeight: '500' }],
      'h2-semi': ['40px', { lineHeight: '50px', fontWeight: '600' }],
      'h2-bold': ['40px', { lineHeight: '50px', fontWeight: '700' }],

      'h3-regular': ['33px', { lineHeight: '43px', fontWeight: '400' }],
      'h3-medium': ['33px', { lineHeight: '43px', fontWeight: '500' }],
      'h3-semi': ['33px', { lineHeight: '43px', fontWeight: '600' }],
      'h3-bold': ['33px', { lineHeight: '43px', fontWeight: '700' }],

      'h4-regular': ['28px', { lineHeight: '36px', fontWeight: '400' }],
      'h4-medium': ['28px', { lineHeight: '36px', fontWeight: '500' }],
      'h4-semi': ['28px', { lineHeight: '36px', fontWeight: '600' }],
      'h4-bold': ['28px', { lineHeight: '36px', fontWeight: '700' }],

      'h5-regular': ['23px', { lineHeight: '30px', fontWeight: '400' }],
      'h5-medium': ['23px', { lineHeight: '30px', fontWeight: '500' }],
      'h5-semi': ['23px', { lineHeight: '30px', fontWeight: '600' }],
      'h5-bold': ['23px', { lineHeight: '30px', fontWeight: '700' }],

      'h6-regular': ['19px', { lineHeight: '25px', fontWeight: '400' }],
      'h6-medium': ['19px', { lineHeight: '25px', fontWeight: '500' }],
      'h6-semi': ['19px', { lineHeight: '25px', fontWeight: '600' }],
      'h6-bold': ['19px', { lineHeight: '25px', fontWeight: '700' }],

      'body-regular': ['16px', { lineHeight: '24px', fontWeight: '400' }],
      'body-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
      'body-semi': ['16px', { lineHeight: '24px', fontWeight: '600' }],
      'body-bold': ['16px', { lineHeight: '24px', fontWeight: '700' }],

      'caption-lg-regular': ['13px', { lineHeight: '18px', fontWeight: '400' }],
      'caption-lg-medium': ['13px', { lineHeight: '18px', fontWeight: '500' }],
      'caption-lg-semi': ['13px', { lineHeight: '18px', fontWeight: '600' }],
      'caption-lg-bold': ['13px', { lineHeight: '18px', fontWeight: '700' }],

      'caption-sm-regular': ['11px', { lineHeight: '15px', fontWeight: '400' }],
      'caption-sm-medium': ['11px', { lineHeight: '15px', fontWeight: '500' }],
      'caption-sm-semi': ['11px', { lineHeight: '15px', fontWeight: '600' }],
      'caption-sm-bold': ['11px', { lineHeight: '15px', fontWeight: '700' }],

      'caption-xs-regular': ['9px', { lineHeight: '12px', fontWeight: '400' }],
      'caption-xs-medium': ['9px', { lineHeight: '12px', fontWeight: '500' }],
      'caption-xs-semi': ['9px', { lineHeight: '12px', fontWeight: '600' }],
      'caption-xs-bold': ['9px', { lineHeight: '12px', fontWeight: '700' }],
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
};
