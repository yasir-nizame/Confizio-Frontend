module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5F6F52", // Base color (unchanged)
        secondary: "#A9B388", // Base color (unchanged)
        light: "#FEFAE0", // Base color (unchanged)
        accent: "#B99470", // Base color (unchanged)

        // Shorter names for shades
        primaryAlt: {
          light: "#78836A", // Lighter shade
          dark: "#4B5641", // Darker shade
        },
        secondaryAlt: {
          light: "#C2CDA3", // Lighter shade
          dark: "#8A926E", // Darker shade
        },
        lightAlt: {
          light: "#FFFCEB", // Lighter shade
          dark: "#E9E6C9", // Darker shade
        },
        accentAlt: {
          light: "#D0AE8C", // Lighter shade
          dark: "#9C7A5C", // Darker shade
        },
      },
    },
  },
  plugins: [],
};
