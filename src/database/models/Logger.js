const winston = require("winston");

const Logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
    ]
});

module.exports = Logger;