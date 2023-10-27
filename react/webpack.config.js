const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        "index": "./src/index.js",
        "markdown": "./src/markdown.js",
        "signin": "./src/signin.js",
        "signup": "./src/signup.js",
        "user-center": "./src/user-center.js",
        "message-transmitter": "./src/message-transmitter.js",
        "gpt": "./src/gpt.js",
        "bookmarks": "./src/bookmarks.js",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
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