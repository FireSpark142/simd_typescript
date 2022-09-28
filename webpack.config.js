const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: "swc-loader"
                },
                exclude: /node_modules/

            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /node_modules/
            },

            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /node_modules/
            }

        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "fs": false,
            "zlib": false
        },

    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "tests/jsonexamples", to: "tests/jsonexamples" },
            ],
        }),
    ],
};