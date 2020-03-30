const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader','sass-loader']
            }
        ]

    },
    plugins: [
        new BundleAnalyzerPlugin()
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'dev.bundle.js'
    }
};