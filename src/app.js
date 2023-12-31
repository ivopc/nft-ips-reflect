require("custom-env").env(process.env.NODE_ENV, "../");
const { setupHttp } = require("./http/index");
setupHttp();