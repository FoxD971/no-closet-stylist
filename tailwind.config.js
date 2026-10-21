/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.js"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontSize: {
                xs: "11px",
                sm: "13px",
                base: "16px",
                lg: "18px",
                xl: "20px",
                "2xl": "24px",
                "3xl": "32px",
            },
            spacing: {
                1: "4px",
                2: "8px",
                3: "12px",
                4: "16px",
                6: "24px",
                8: "32px",
            },
            borderRadius: {
                sm: "6px",
                base: "8px",
                md: "12px",
                lg: "16px",
                xl: "20px",
                "2xl": "24px",
                "3xl": "32px",
            },
            colors: {
                brand: {
                    50: "#FAFAFA",  // Off-white / Cloud
                    100: "#F4F4F5", // Light Gray
                    500: "#000000", // PRIMARY BLACK
                    600: "#18181B", // Zinc 900
                    900: "#09090B", // Zinc 950 (Deep Bg)
                },
                accent: {
                    DEFAULT: "#00D9FF", // Electric Blue (Tech vibe)
                    red: "#FF3B30",     // Fashion Red
                },
                glass: {
                    light: "rgba(255, 255, 255, 0.7)",
                    dark: "rgba(0, 0, 0, 0.7)",
                }
            },
            fontFamily: {
                sans: ["Inter", "System", "sans-serif"],
                serif: ["Playfair Display", "Georgia", "serif"], // Fashion Header
            },
        },
    },
    plugins: [],
};
