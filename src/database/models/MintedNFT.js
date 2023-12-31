const { DataTypes } = require("sequelize");
const db = require("../index.js");

const MintedNFT = db.define("MintedNFT", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transaction_hash: DataTypes.STRING,
    from_address: DataTypes.STRING,
    token_id: DataTypes.STRING,
    ipfsImageHash: DataTypes.STRING,
    ipfsJSONHash: DataTypes.STRING,
    ipfsImageTimestamp: DataTypes.DATE,
    ipfsJSONTimestamp: DataTypes.DATE
});

async function insert ({ 
    transaction_hash, 
    from_address, 
    token_id,
    ipfs: {
        image: {
            hash: ipfsImageHash,
            timestamp: ipfsImageTimestamp
        },
        json: {
            hash: ipfsJSONHash,
            timestamp: ipfsJSONTimestamp
        }
    }
}) {
    try {
        await MintedNFT.create({ transaction_hash, from_address, token_id, ipfsImageHash, ipfsJSONHash, ipfsImageTimestamp, ipfsJSONTimestamp });
    } catch (err) {
        throw err;
    };
};

async function findByTokenId (token_id) {
    try {
        const nft = await MintedNFT.findOne({
            where: { token_id }
        });
        return nft;
    } catch (err) {
        throw err;
    };
};

/**
 * 
 * @param {string} transaction_hash 
 * @returns {boolean}
 */
async function alreadyExists (transaction_hash) {
    return !!await MintedNFT.findOne({ where: { transaction_hash } });
};


async function sync () {
    await MintedNFT.sync({ alter: true });
};

module.exports = { insert, findByTokenId, alreadyExists, sync };