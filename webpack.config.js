const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      http: false,
      // fs: false,
    },
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  entry: path.resolve(__dirname, "bin", "www.ts"),
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
