const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {

    mode: 'development',

    devtool: 'inline-source-map',

    devServer: {
        static: './dist'
    },

    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: { sourceMap: true }},
                    {loader: 'postcss-loader', options: { sourceMap: true }},
                    {loader: 'sass-loader', options: { sourceMap: true }},
                ]
            },
        ]
    },

    optimization: {
        runtimeChunk: 'single'
    }

})