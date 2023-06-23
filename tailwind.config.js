/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        devLogSprint: '#f97316',
        devLogStory: '#047857',
        devLogWork: '#0e7490',
        devLogToDo: '#f87171',
        devLogProgress: '#fbbf24',
        devLogDone: '#6ee7b7',
        paymentsCompany: '#047857',
        paymentsGray: '#64748b',
        paymentsGod: '#fbbf24',
        paymentsNotYet: '#f97316',
        paymentsPass: '#6366f1'
      },
    },
  },
  plugins: [],
}
