const Moralis = require("moralis/node");
require("custom-env").env(process.env.NODE_ENV);
const serverUrl = process.env.MORALIS_SERVER_URL; // https://qugkegnpnnm4.usemoralis.com:2053/server
const appId = process.env.MORALIS_APP_ID;///"mBQjdHn5Y7nSObcEYbnrSBxxrCXPCpYwDmiBZS4c";
const masterKey = process.env.MORALIS_MASTER_KEY;//"ITpVMfmh32PHReXZwEO0820bqkPSq4LftnehyvJX";

async function getMoralis () {
    await Moralis.start({ serverUrl, appId, masterKey });
};

module.exports = getMoralis;