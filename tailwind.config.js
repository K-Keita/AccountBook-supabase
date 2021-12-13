module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minHeight: {
      sm: "300px",
      lg: "90vh",
      "3lg": "380px",
      screen: "100vh",
    },
    maxHeight: {
      sm: "22px",
    },
    minWidth: {
      lg: "48px",
      "2lg": "80px",
      xl: "100px",
      "2xl": "120px",
      "3xl": "320px",
      "3l": "30%",
      "4l": "40%",
    },
    maxWidth: {
      lg: "110px",
      xl: "320px",
      "2xl": "330px",
      "3xl": "550px",
      "4xl": "600px",
      "6xl": "950px",
    },
    extend: {
      colors: {
        flower: "#ec4999",
      },
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
        google: "#3F7EE7",
        flower: "#ec4999",
        dark: "#2a1e5b",
        dark2: "#101827",
        home: "#140233",
        item: "#7a6cb2",
        selected: "#ed477b",
      },
      animation: {
        "slit-in-vertical": "slit-in-vertical 0.5s ease both",
        "slide-in-bck-center":
          "slide-in-bck-center 1.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "scale-in-ver-bottom":
          "scale-in-ver-bottom 0.8s cubic-bezier(0.250, 0.400, 0.450, 0.840)  0.4s both",
        "slide-in-bottom":
          "slide-in-bottom 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "slide-in-top":
          "slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "tilt-in-top-1":
          "tilt-in-top-1 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "tilt-in-right-1":
          "tilt-in-right-1 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.2s  both",
        "tilt-in-left-1":
          "tilt-in-left-1 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940)  0.2s both",
        "rotate-90-ccw":
          "rotate-90-ccw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "rotate-center":
          "rotate-center 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955)   both",
        "flip-vertical-right":
          "flip-vertical-right 0.4s cubic-bezier(0.455, 0.030, 0.515, 0.955)   both",
        "slide-fwd-center":
          "slide-fwd-center 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "wobble-hor-bottom": "wobble-hor-bottom 0.8s ease   both",
        "jello-horizontal": "jello-horizontal 0.8s ease   both",
        "wobble-hor-top": "wobble-hor-top 0.8s ease   both",
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
        "tilt-in-top-1": {
          "0%": {
            transform: "rotateY(30deg) translateY(-300px) skewY(-30deg)",
            opacity: "0",
          },
          "100%": {
            transform: "rotateY(0deg) translateY(0) skewY(0deg)",
            opacity: "1",
          },
        },
        "tilt-in-right-1": {
          "0%": {
            transform: "rotateX(-30deg) translateX(300px) skewX(30deg)",
            opacity: "0",
          },
          "100%": {
            transform: "rotateX(0deg) translateX(0) skewX(0deg)",
            opacity: "1",
          },
        },
        "tilt-in-left-1": {
          "0%": {
            transform: "rotateX(-30deg) translateX(-300px) skewX(-30deg)",
            opacity: "0",
          },
          "100%": {
            transform: "rotateX(0deg) translateX(0) skewX(0deg)",
            opacity: "1",
          },
        },
        "rotate-90-ccw": {
          "0%": {
            transform: "rotate(0)",
          },
          to: {
            transform: "rotate(-90deg)",
          },
        },
        "rotate-center": {
          "0%": {
            transform: "rotate(0)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "flip-vertical-right": {
          "0%": {
            transform: "rotateY(0)",
          },
          to: {
            transform: "rotateY(180deg)",
          },
        },
        "slide-fwd-center": {
          "0%": {
            transform: "translateZ(0)",
          },
          to: {
            transform: "translateZ(160px)",
          },
        },
        "wobble-hor-bottom": {
          "0%,to": {
            transform: "translateX(0%)",
            "transform-origin": "50% 50%",
          },
          "15%": {
            transform: "translateX(-10px) rotate(-6deg)",
          },
          "30%": {
            transform: "translateX(8px) rotate(6deg)",
          },
          "45%": {
            transform: "translateX(-8px) rotate(-3.6deg)",
          },
          "60%": {
            transform: "translateX(4px) rotate(2.4deg)",
          },
          "75%": {
            transform: "translateX(-4px) rotate(-1.2deg)",
          },
        },
        "jello-horizontal": {
          "0%,to": {
            transform: "scale3d(1, 1, 1)",
          },
          "30%": {
            transform: "scale3d(1.25, .75, 1)",
          },
          "40%": {
            transform: "scale3d(.75, 1.25, 1)",
          },
          "50%": {
            transform: "scale3d(1.15, .85, 1)",
          },
          "65%": {
            transform: "scale3d(.95, 1.05, 1)",
          },
          "75%": {
            transform: "scale3d(1.05, .95, 1)",
          },
        },
        "wobble-hor-top": {
          "0%,to": {
            transform: "translateX(0%)",
            "transform-origin": "50% 50%",
          },
          "15%": {
            transform: "translateX(-16px) rotate(6deg)",
          },
          "30%": {
            transform: "translateX(12px) rotate(-6deg)",
          },
          "45%": {
            transform: "translateX(-12px) rotate(3.6deg)",
          },
          "60%": {
            transform: "translateX(6px) rotate(-2.4deg)",
          },
          "75%": {
            transform: "translateX(-3px) rotate(1.2deg)",
          },
        },
      },
      letterSpacing: {
        lg: "0.5em",
      },
      zIndex: {
        "-10": "-10",
        "-20": "-20",
      },
      height: {
        lg: "65vh",
        "2lg": "45vh",
        "3lg": "60vh",
        "4lg": "30vh",
        "5lg": "90vh",
        "6lg": "80vh",
      },
      width: {
        almostFull: "98%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
