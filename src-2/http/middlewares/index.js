const express = require("express");

/**
 * @param app {express.Application}
 */
module.exports = app =>
    app
        .use(express.json())
        .use(express.urlencoded({ extended: true }));