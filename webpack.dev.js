const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");

const config = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

module.exports = webpackMerge(baseConfig, config);
