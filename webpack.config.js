const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             use: 'babel-loader'
    //         },
            // {
                // test: /.s?scss$/,
                // use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            // },
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
        minimize: true,
    },
    plugins: [new MiniCssExtractPlugin()]
}