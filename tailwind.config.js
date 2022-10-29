/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [],
    theme: {
        extend: {

        },
        screens: {
            "sm": "640px",

            // => @media (min-width: 640px) { ... }

            "md": "768px",

            // => @media (min-width: 768px) { ... }

            "lg": "1024px",

            // => @media (min-width: 1024px) { ... }

            "xl": "1280px",

            // => @media (min-width: 1280px) { ... }

            "2xl": "1536px",

            // => @media (min-width: 1536px) { ... }
        },
        colors: {
            "primary": "#fc5c3e",
            "bg": "#F6F6F6",
            "secondary": "#7A7A7A",
            "tertiary": "#A4A4A4",
            "dark": "#172123",
        },
        fontFamily: {
            "sans": ["main","Inter, sans-serif"],
        },
        backgroundImage: {
            "desktop": "url('/img/)",
            "mobile" : "url('/img/)"
        }
    },
    plugins: [],
};
