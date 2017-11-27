// module.exports = {
//   entry: "./main",
//   output: { filename: 'app.js' },
//   module: {
//     loaders: [
//       {
//         test: '/.ts$/',
//         loader: 'ts-loader',
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.ts', '.js'],
//   },
// };

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'app.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
};
