import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                outfit: ["var(--font-outfit)"],
            },
            keyframes: {
                gradientShimmer: {
                    "0%": { backgroundPosition: "200% center" },
                    "100%": { backgroundPosition: "-200% center" },
                },
                blobPulse: {
                    "0%, 100%": { transform: "scale(1)", opacity: "0.2" },
                    "50%": { transform: "scale(1.2)", opacity: "0.4" },
                },
            },
            animation: {
                "gradient-shimmer": "gradientShimmer 3s linear infinite",
                "blob-pulse": "blobPulse 10s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
export default config;
