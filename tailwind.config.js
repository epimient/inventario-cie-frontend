/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                headline: ['Inter', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                label: ['Inter', 'sans-serif']
            },
            colors: {
            'on-background': 'rgb(var(--on-background) / <alpha-value>)',
            'on-secondary': 'rgb(var(--on-secondary) / <alpha-value>)',
            'surface-container-high': 'rgb(var(--surface-container-high) / <alpha-value>)',
            'surface-container-highest': 'rgb(var(--surface-container-highest) / <alpha-value>)',
            'primary': 'rgb(var(--primary) / <alpha-value>)',
            'on-secondary-container': 'rgb(var(--on-secondary-container) / <alpha-value>)',
            'secondary-dim': 'rgb(var(--secondary-dim) / <alpha-value>)',
            'inverse-surface': 'rgb(var(--inverse-surface) / <alpha-value>)',
            'secondary-container': 'rgb(var(--secondary-container) / <alpha-value>)',
            'outline': 'rgb(var(--outline) / <alpha-value>)',
            'on-tertiary-container': 'rgb(var(--on-tertiary-container) / <alpha-value>)',
            'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
            'on-error': 'rgb(var(--on-error) / <alpha-value>)',
            'surface': 'rgb(var(--surface) / <alpha-value>)',
            'on-primary-fixed': 'rgb(var(--on-primary-fixed) / <alpha-value>)',
            'on-surface-variant': 'rgb(var(--on-surface-variant) / <alpha-value>)',
            'on-secondary-fixed-variant': 'rgb(var(--on-secondary-fixed-variant) / <alpha-value>)',
            'primary-container': 'rgb(var(--primary-container) / <alpha-value>)',
            'on-surface': 'rgb(var(--on-surface) / <alpha-value>)',
            'surface-dim': 'rgb(var(--surface-dim) / <alpha-value>)',
            'tertiary-container': 'rgb(var(--tertiary-container) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary) / <alpha-value>)',
            'surface-container-low': 'rgb(var(--surface-container-low) / <alpha-value>)',
            'surface-variant': 'rgb(var(--surface-variant) / <alpha-value>)',
            'on-primary-container': 'rgb(var(--on-primary-container) / <alpha-value>)',
            'background': 'rgb(var(--background) / <alpha-value>)',
            'surface-container-lowest': 'rgb(var(--surface-container-lowest) / <alpha-value>)',
            'error-container': 'rgb(var(--error-container) / <alpha-value>)',
            'on-secondary-fixed': 'rgb(var(--on-secondary-fixed) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary) / <alpha-value>)',
            'on-tertiary': 'rgb(var(--on-tertiary) / <alpha-value>)',
            'error': 'rgb(var(--error) / <alpha-value>)',
            'surface-bright': 'rgb(var(--surface-bright) / <alpha-value>)',
            'secondary-fixed': 'rgb(var(--secondary-fixed) / <alpha-value>)',
            'primary-fixed': 'rgb(var(--primary-fixed) / <alpha-value>)',
            'secondary-fixed-dim': 'rgb(var(--secondary-fixed-dim) / <alpha-value>)',
            'on-tertiary-fixed': 'rgb(var(--on-tertiary-fixed) / <alpha-value>)',
            'inverse-on-surface': 'rgb(var(--inverse-on-surface) / <alpha-value>)',
            'tertiary-fixed': 'rgb(var(--tertiary-fixed) / <alpha-value>)',
            'primary-dim': 'rgb(var(--primary-dim) / <alpha-value>)',
            'error-dim': 'rgb(var(--error-dim) / <alpha-value>)',
            'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',
            'inverse-primary': 'rgb(var(--inverse-primary) / <alpha-value>)',
            'surface-container': 'rgb(var(--surface-container) / <alpha-value>)',
            'on-error-container': 'rgb(var(--on-error-container) / <alpha-value>)',
            'primary-fixed-dim': 'rgb(var(--primary-fixed-dim) / <alpha-value>)',
            'surface-tint': 'rgb(var(--surface-tint) / <alpha-value>)',
            'on-tertiary-fixed-variant': 'rgb(var(--on-tertiary-fixed-variant) / <alpha-value>)',
            'tertiary-dim': 'rgb(var(--tertiary-dim) / <alpha-value>)',
            'on-primary-fixed-variant': 'rgb(var(--on-primary-fixed-variant) / <alpha-value>)',
            'tertiary-fixed-dim': 'rgb(var(--tertiary-fixed-dim) / <alpha-value>)'
},
            borderRadius: {
                DEFAULT: "1rem", 
                lg: "2rem", 
                xl: "3rem", 
                full: "9999px"
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ],
}
