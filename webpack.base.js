const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CustomPlugin = require("./customPlugin");

const config = {
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".txt"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: [path.resolve("src")],
        loader: "ts-loader",
        options: {
          transpileOnly: false,
          compilerOptions: {
            module: "es2015",
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
