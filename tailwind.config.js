module.exports = {
	darkMode: 'class',
	content: ["./**/*.html", "./src/**/*.js", "./node_modules/flowbite/**/*.js"],
	theme: {
		screens: {
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [require("flowbite/plugin")],
};
