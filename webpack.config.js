/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DefinePlugin = require("webpack").DefinePlugin;

const common = {
    entry: "./src/index.ts",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")],
            },
            {
                test: /\.csv$/i,
                use: "raw-loader",
            },
            {
                test: /\.(png|jpg|ttf)$/,
                loader: "url-loader",
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js"],
    },
};

const local = {
    ...common,

    name: "local",

    mode: "development",

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "app.js",
        publicPath: "/",
    },

    devServer: {
        static: {
            directory: path.join(__dirname, "./dist"),
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        compress: true,
        port: 7777,
        open: {
            // target: [`/?showcheats=true&user_id=${crypto.randomUUID()}`],
            app: {
                name: process.platform == "linux" ? "google-chrome" : "Chrome",
            },
        },
    },

    devtool: "eval-cheap-module-source-map",

    plugins: [
        new DefinePlugin({
            __ENVIRONMENT__: `"local"`,
        }),
        new CopyPlugin({
            patterns: [
                { from: "./prodIndex.html", to: "./index.html" },
                { from: "./assets", to: "./assets" },
            ],
        }),
    ],
};

const dev = {
    ...common,

    name: "dev",

    mode: "development",

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "app.js",
        publicPath: "/",
    },

    devtool: "eval-cheap-module-source-map",

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "./prodIndex.html", to: "./index.html" },
                { from: "./assets", to: "./assets" },
            ],
        }),
        new DefinePlugin({
            __ENVIRONMENT__: `"dev"`,
        }),
    ],
};

const prod = {
    ...common,

    name: "prod",

    mode: "production",

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "app.js",
        publicPath: "/",
    },

    devtool: false,

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "./prodIndex.html", to: "./index.html" },
                { from: "./assets", to: "./assets" },
            ],
        }),
        new DefinePlugin({
            __ENVIRONMENT__: `"prod"`,
        }),
    ],
};

module.exports = [local, dev, prod];
