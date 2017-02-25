var path = require('path');

module.exports = {
  entry: './src/iiifEventedCanvas.js',
  output: {
    path: __dirname,
    filename: 'dist/iiif-evented-canvas.js',
    libraryTarget:'umd',
    library: 'iiifEventedCanvas'
  },
  module: {
    loaders: [
      { test: path.join(__dirname, 'src'),
        loader: 'babel-loader' }
    ]
  }
};
