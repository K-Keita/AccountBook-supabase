module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minHeight: {
      sm: "300px",
      lg: "90vh",
      screen: "100vh",
    },
    minWidth: {
      lg: "50px",
      "2lg": "80px",
      xl: "100px",
      "3l": "30%",
      "4l": "40%",
    },
    maxWidth: {
      lg: "110px",
    },
    extend: {
      gradientColorStops: (theme) => ({
        ...theme("colors"),
        dark: "#2a1e5b",
        secondary: "#ffed4a",
        danger: "#101827",
      }),
      borderColor: (theme) => ({
        ...theme("colors"),
        DEFAULT: theme("colors.gray.300", "currentColor"),
        flower: "#ec4999",
      }),
      backgroundColor: {
        // dark: "#120150",
        dark: "#2a1e5b",
        dark2: "#101827",
        home: "#140233",
        item: "#7a6cb2",
        selected: "#ed477b",
        // item: "rgba(146, 135, 191, 40)",
      },
      animation: {
        "slit-in-vertical": "slit-in-vertical 0.5s ease both",
        "slide-in-bck-center":
          "slide-in-bck-center 1.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "scale-in-ver-bottom":
          "scale-in-ver-bottom 0.8s cubic-bezier(0.250, 0.400, 0.450, 0.840)  0.2s both",
        "slide-in-bottom":
          "slide-in-bottom 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "slide-in-top":
          "slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
      },
      keyframes: {
        "slide-in-top": {
          "0%": {
            transform: "translateY(-1000px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "slide-in-bottom": {
          "0%": {
            transform: "translateY(1000px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "scale-in-ver-bottom": {
          "0%": {
            transform: "scaleY(0)",
            "transform-origin": "0% 100%",
            opacity: "1",
          },
          to: {
            transform: "scaleY(1)",
            "transform-origin": "0% 100%",
            opacity: "1",
          },
        },
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
        lg: "65vh",
        "2lg": "50vh",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
