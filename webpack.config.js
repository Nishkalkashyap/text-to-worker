const path = require('path');

module.exports = {
    entry: path.resolve('./src/index.ts'),
    output: {
        filename: "index.js",
        path: path.resolve('./lib'),
        libraryTarget: 'umd'
    },
    mode: 'production',
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader'
        }]
    },
    target: 'node'
}