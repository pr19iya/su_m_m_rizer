const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  devtool: "cheap-module-source-map",
  entry: {
    sidepanel: path.resolve("src", "sidepanel"),
    options: path.resolve("src", "options"),
    background: path.resolve("src", "background"),
    contentScript: path.resolve("src", "selectionOverlay"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        use: "asset/resource",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src", "static"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHtmlPlugins(["sidepanel", "options"]),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== "contentScript";
      },
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlWebpackPlugin({
        title: "Summarizer",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
