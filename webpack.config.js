const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        new CopyWebpackPlugin(['src/**/*.d.ts'])
    ],
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(ts|tsx)$/,
                loader: 'tslint-loader',
                exclude: [
                    /node_modules/,
                    /demo/
                ]
            },
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: [
                    /node_modules/,
                    /demo/
                ]
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/,
                    /demo/
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts','.tsx', '.css'],
        alias: {
            'react-wooden-tree': 'src/'
        }
    },
    externals: {
        'react': {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
        }
    }
};
