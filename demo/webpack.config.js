const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        'demo': resolve(__dirname, './src/index.tsx'),
    },
    devtool: 'source-map',
    output: {
        path: resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    plugins: [
        new CopyWebpackPlugin(['src/**/*.d.ts']),
        new HtmlWebPackPlugin({
            template: './public/index.html',
            filename: './index.html',
        })
    ],
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(ts|tsx)$/,
                loader: 'tslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    resolve: {extensions: ['.js', '.ts','.tsx', '.css']},
};
