const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {

    mode: 'development',

    entry: {
        index: './src/js/index.js',
    },

    devtool: 'inline-source-map',

    devServer: {
        static: './dist'
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Fortune 50',
        }),
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },

    module: {
        rules: []
    },

    optimization: {
        runtimeChunk: 'single'
    }

}