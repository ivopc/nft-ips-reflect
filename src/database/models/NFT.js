const { DataTypes } = require("sequelize");
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
    token_id: DataTypes.STRING,
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

async function update (id, data) {
    try {
        await NFT.update(data, {
            where: { token_id: id }
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

module.exports = { insert, update, findByTokenId, sync };