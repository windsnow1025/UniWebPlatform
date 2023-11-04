const fs = require('fs');
const path = require('path');

const entryDir = path.resolve(__dirname, 'src', 'entry');
const entryFiles = fs.readdirSync(entryDir).filter(file => file.endsWith('.js'));

const entry = {};

entryFiles.forEach(file => {
    const name = path.basename(file, '.js');
    entry[name] = path.join(entryDir, file);
});

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: entry,
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