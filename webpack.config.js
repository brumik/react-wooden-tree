const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        'react-wooden-tree': resolve(__dirname, './src/index.ts'),
    },
    devtool: 'source-map',
    output: {
        path: resolve(__dirname, './dist'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(ts|tsx)$/,
                exclude: /node_modules|benchmark|demo-app/,
                loader: "tslint-loader"
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules|benchmark|demo-app/
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader'
                    ]
                })
            },
        ]
    },
    resolve: {extensions: ['.js', '.ts','.tsx', '.css']},
    externals: {
        'react': {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
        }
    }
};