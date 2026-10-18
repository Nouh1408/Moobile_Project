/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        flatDark: '#1A1A1A',
        flatGray: '#4A4A4A',
        flatMuted: '#71717A',
        flatBorder: '#E4E4E7',
        flatBg: '#FAFAFA',
        flatBlue: '#0066FF',
        flatRed: '#DC2626',
        flatGreen: '#16A34A',
        smallText: '#667b99',
      },
      borderRadius: {
        'flat-sm': '2px',
        'flat-md': '4px',
        'flat-lg': '8px',
      },
      backgroundColor: {
        homeBG: "#fbfbfb",
      },
    },
  },
  plugins: [],
}