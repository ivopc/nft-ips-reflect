const express = require("express");

const nft = require("./nft");

/**
 * @param app {express.Application}
 */
module.exports = app =>
    app
        .use("/nft", nft);