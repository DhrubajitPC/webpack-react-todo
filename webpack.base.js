const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CustomPlugin = require("./customPlugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const config = {
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".txt"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } }, // or whatever your project requires
              ],
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
            plugins: ["react-hot-loader/babel"],
          },
        },
      },
      {
        test: /\.(txt)$/i,
        loader: path.resolve(__dirname, "customLoader.js"),
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: "./index.html",
      inject: true,
      filename: "./index.html",
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
      },
    }),
    new CustomPlugin(),
  ],
};

module.exports = config;
