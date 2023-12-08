const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
	mode: "development",
	entry: {
		bundle: "./src/index.js",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
		assetModuleFilename: "[name][ext]",
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, "dist"),
		},
		port: 3001,
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				include: path.resolve(__dirname, "./src"),
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/template.html",
		}),
		new CopyPlugin({
			patterns: [
			  { from: "./src/assets", to: "assets" },
			],
		  }),
	],
};