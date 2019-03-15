const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src/index.tsx'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: `[name].js`,
		libraryExport: 'default',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'awesome-typescript-loader',
					options: {
						useCache: true,
					}
				}
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	externals: [
		'react'
	]
};
