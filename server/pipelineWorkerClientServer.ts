import * as path from "path";
import * as proxy from "express-http-proxy";

const express = require("express");

let webpackConfig = null;
let Webpack = null;
let webpackDevServer = null;
let compiler = null;

if (process.env.NODE_ENV !== "production") {
    webpackConfig = require("../webpack.dev.config.js");
    Webpack = require("webpack");
    webpackDevServer = require("webpack-dev-server");
    compiler = Webpack(webpackConfig);
}

import {Configuration} from "./configuration";
import * as os from "os";

const rootPath = path.resolve(path.join(__dirname, "..", "public"));

const apiUri = `http://${Configuration.apiHostname}:${Configuration.apiPort}`;

let app = null;

if (process.env.NODE_ENV !== "production") {
    app = devServer();
} else {
    app = express();

    app.use(express.static(rootPath));

    app.post("/graphql", proxy(apiUri + "/graphql"));

    app.use("/", (req, res) => {
        res.sendFile(path.join(rootPath, "index.html"));
    });
}

app.listen(Configuration.port, "0.0.0.0", () => {
    if (process.env.NODE_ENV !== "production") {
        console.log(`Listening at http://${os.hostname()}:${Configuration.port}/`);
    }
});

function devServer() {
    return new webpackDevServer(compiler, {
        stats: {
            colors: true
        },
        proxy: {
            "/graphql": {
                target: apiUri
            }
        },
        contentBase: path.resolve(path.join(__dirname, "..", "public")),
        disableHostCheck: true,
        publicPath: webpackConfig.output.publicPath,
        // hot: true,
        historyApiFallback: true,
        noInfo: false,
        quiet: false
    });
}

