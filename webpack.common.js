const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {

    entry: {
        index: './src/js/controller.js',
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Fortune 50',
            favicon: './src/images/favicon.ico'

        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(ttf|otf)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(png|svg|jpg|jpeg|ico)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(mp3|wav|ogg)$/i,
                type: 'asset/resource'
            },
        ]
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}