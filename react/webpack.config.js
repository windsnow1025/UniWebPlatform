const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        "index": "./public/js/index.js",
        "markdown": "./public/js/markdown.js",
        "user": "./public/js/user.js",
        "user-center": "./public/js/user-center.js",
        "message-transmitter": "./public/js/message-transmitter.js",
        "gpt": "./public/js/gpt.js",
        "bookmarks": "./public/js/bookmarks.js",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Add jsx here
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};