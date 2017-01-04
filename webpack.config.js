const webpack = require('webpack');
const path = require('path');
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
}

module.exports = {
  entry: path.resolve(__dirname, 'client.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build',
    filename: 'bundle.js'
  },
  devServer: {
    port: 3000
  },
  module: {
    rules: [
        {
            test: /\.js?$/,
            use: ['babel-loader'],
            exclude: [
                path.resolve(__dirname, "node_modules")
            ],
            options: {
                presets: ['react', 'es2015', 'stage-0']
            }
        },
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        }
    ]
  },
  plugins: plugins
};
