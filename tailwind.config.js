module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minHeight: {
      sm: "300px",
      lg: "90vh",
    },
    minWidth: {
      lg: "50px",
      xl: "110px",
      "4l": "40%",
    },
    extend: {
      gradientColorStops: (theme) => ({
        ...theme("colors"),
        dark: "#2a1e5b",
        secondary: "#ffed4a",
        danger: "#e3342f",
      }),
      backgroundColor: {
        // dark: "#120150",
        dark: "#2a1e5b",
        // item: "#b09db7",
        item: "#7a6cb2",
        selected: "#42e9fa",
        // item: "rgba(146, 135, 191, 40)",
      },
      animation: {
        "slit-in-vertical": "slit-in-vertical 0.5s ease both",
        "slide-in-bck-center":
          "slide-in-bck-center 1.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
      keyframes: {
        "slit-in-vertical": {
          "0%": {
            transform: "translateZ(-800px) rotateY(90deg)",
            opacity: "0",
          },
          "54%": {
            transform: "translateZ(-160px) rotateY(87deg)",
            opacity: "1",
          },
          to: {
            transform: "translateZ(0) rotateY(0)",
          },
        },
        "slide-in-bck-center": {
          "0%": {
            transform: "translateZ(600px)",
            opacity: "0",
          },
          to: {
            transform: "translateZ(0)",
            opacity: "1",
          },
        },
      },
      zIndex: {
        "-10": "-10",
        "-20": "-20",
      },
      height: {
        lg: "60vh",
        "2lg": "50vh",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
