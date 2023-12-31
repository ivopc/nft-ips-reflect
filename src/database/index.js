const fs = require("fs");
const { Sequelize } = require("sequelize");
const path = require("path");

/**
 * @todo refactor the NODE_ENV check
 */

require("custom-env").env(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development" && !fs.existsSync(path.join(__dirname, "db.sqlite"))) {
    fs.writeFileSync(path.join(__dirname, "db.sqlite"), "");
};

/**
 * @type {Sequelize}
 */
const db = new Sequelize({
    dialect: process.env.DATABASE,
    storage: process.env.NODE_ENV === "development" ? path.join(__dirname, "db.sqlite") : "",
    logging: false
});

;(async () => {
    try {
        await db.authenticate();
        console.log("[Sequelize] Database connected.");
        //await db.sync({ alter: true });
        await db.sync();
        console.log("[Sequelize] Database sync.");
    } catch (err) {
        console.error("[Sequelize] Unable to connect to the database");
        throw err;
    }
})();

module.exports = db;