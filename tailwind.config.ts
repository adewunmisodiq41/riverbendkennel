import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C2418",
        pine: "#2F4030",
        pinelight: "#44573F",
        paper: "#F6F2E9",
        paperdim: "#EDE7D8",
        brass: "#A9812C",
        brasslight: "#C9A24B",
        clay: "#8C5A3C",
        mist: "#DAD9CE"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-worksans)", "system-ui", "sans-serif"]
      },
      maxWidth: {
        prose: "68ch"
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        reveal: "reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards"
      }
    }
  },
  plugins: []
};

export default config;
