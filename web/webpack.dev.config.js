const config = require("config");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: ["./main.js"],
  devtool: "eval-source-map",
  output: {
    path: path.join(__dirname, "dist"), // this path is in dev-server memory
    publicPath: "/",
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.template.html",
      inject: "body",
      filename: "index.html",
    }),
    new CopyWebpackPlugin([{ from: "static", to: __dirname + "/dist" }]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      API_URL: JSON.stringify(config.web.apiUrl),
      SERVE_WEB: config.web.serveWeb === "true",
    }),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "components/"),
      "@services": path.resolve(__dirname, "services/"),
      "@store": path.resolve(__dirname, "store/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
};
