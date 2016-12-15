import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";

const config = require("./webpack.config");

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    proxy: {"/graphql": `http://localhost:3001`},
    historyApiFallback: true,
    noInfo: false,
    quiet: false
}).listen(4001, "0.0.0.0", function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log("Listening at http://localhost:4001/");
});
