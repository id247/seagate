'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	cache: true,
	entry: {
		index: './src/js/index',
	},
	output: {
		path: __dirname + '/production/js',
		filename: '[name].js',
		publicPath: __dirname + '/production/js',
		pathinfo: true
	},

	resolve: {
		modulesDirectories: ['node_modules'],
		extentions: ['', '.js'],
		alias: {
		}
	},

	module: {
		noParse: [
		],
		loaders: [
			{   test: /\.js$/, 
				loader: 'babel',
				include: [
					__dirname + '/src/js'
				], 
				query: {
					cacheDirectory: true,
					presets: ['es2015']
				}
			},
			{ 	test: /\.js$/, 
				include: [
					__dirname + '/src/js'
				], 
				loader: 'strip-loader?strip[]=console.log' 
			}
		]
	},
	plugins: [     
		new webpack.DefinePlugin({
			'process.env': { 
				NODE_ENV : JSON.stringify('production') 
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false
			}
		})
	]
};

