const express = require("express");

const setupMiddlewares = require("./middlewares");
const setupRoutes = require("./routes");

const app = express();

/**
 * @type {express.Application}
 */
 exports.app = app;

exports.setupHttp = () => {
    setupMiddlewares(app);
    setupRoutes(app);
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log("Server is listening on :" + port));
};