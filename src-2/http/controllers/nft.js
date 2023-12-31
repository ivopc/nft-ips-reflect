const express = require("express");
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function generateNFT (req, res) {
    const { txhash } = req.body;
    if (!txhash) 
        return;
    try {
        const nft = await buildNFT(txhash);
        res.json(nft.map(({ image }) => ({ image: `https://nft-art-generator.mypinata.cloud/ipfs/${image.IpfsHash}` })));
        // fetchWaitingNFTsBefore(token_id);
    } catch (err) {
        res.status(500).json({ error: "Something bad happened while it tries to build your NFT." });
        Logger.error({
            error: err.message,
            txhash,
            IP: req.headers["x-forwarded-for"] || req.socket.remoteAddress 
        });
    };
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function fetchNFT (req, res) {
    const { token_id } = req.query;
    if (!token_id) 
        return;
    try {
        const nft = await fetchNFTFromList(token_id.split(","));
        res.json(nft);
    } catch (err) {
        res.status(500).json({ error: "Something bad happened while it tries to find the NFT.", message: err.message });
        Logger.error({
            error: err,
            token_id,
            IP: req.headers["x-forwarded-for"] || req.socket.remoteAddress 
        });
    };
};

module.exports = { generateNFT, fetchNFT };

const buildNFT = require("../../services/nft/nft-build.service");
const { fetchNFTFromList } = require("../../services/nft/nft-generics.service");
const Logger = require("../../database/models/Logger");
const { fetchWaitingNFTsBefore } = require("../../services/nft/nft-order-checker.service");