const express = require("express");
const buildFromList = require("../../services/nft/nft-build.service");
const { fetchNFTFromList } = require("../../services/nft/nft-generics.service");
const Logger = require("../../database/models/Logger");

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
        const response = await buildFromList(txhash.split(","));
        res.json(
            response.map(({ image }) => ({ image: `https://ipfs.io/ipfs/${image.IpfsHash}` }))
        );
    } catch (err) {
        res.status(500).json({ error: "Something bad happened while it tries to build your NFT." });
        Logger.error(err);
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
        Logger.error(err);
    };
};

module.exports = { generateNFT, fetchNFT };