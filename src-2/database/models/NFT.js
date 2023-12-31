const { DataTypes, Op } = require("sequelize");
const db = require("../index.js");

const NFT = db.define("NFT", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    token_id: DataTypes.NUMBER,
    external_url: {
        type: DataTypes.STRING,
        defaultValue: "https://babyelephant.finance/"
    },
    compiler: {
        type: DataTypes.STRING,
        defaultValue: "https://babyelephant.finance/"
    }
});

async function insert ({ address, name, description, external_url, image, token_id }) {
    try {
        return await NFT.create({ address, name, description, external_url, image, token_id });
    } catch (err) {
        throw err;
    };
};

async function update (token_id, data) {
    try {
        await NFT.update(data, {
            where: { token_id }
        });
    } catch (err) {
        throw err;
    };
};

async function findByTokenId (token_id) {
    try {
        const nft = await NFT.findOne({
            where: { token_id }
        });
        return nft;
    } catch (err) {
        throw err;
    };
};

async function sync () {
    await NFT.sync({ alter: true });
};

async function findMinorThanAndNotMinted (token_id) {
    try {
        const notMintedNFTs = await NFT.findAll({
            where: {
                token_id: {
                    [Op.lt]: token_id
                },
                address: ""
            }
        });
        return notMintedNFTs.dataValue.map(({ token_id }) => token_id);
    } catch (err) {
        throw err;
    };
};

module.exports = { insert, update, findByTokenId, findMinorThanAndNotMinted, sync };