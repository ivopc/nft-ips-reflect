const { DataTypes } = require("sequelize");
const db = require("../index.js");

const TraitsNFT = db.define("TraitsNFT", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nft_owner: DataTypes.INTEGER,
    trait_type: DataTypes.STRING,
    value: DataTypes.STRING
});

async function insert ({ nft_owner, trait_type, value }) {
    try {
        const insertData = await TraitsNFT.create({ nft_owner, trait_type, value });
        return insertData;
    } catch (err) {
        throw err;
    };
};

async function findByNFTOwner (nft_owner) {
    try {
        const fetchedData = await TraitsNFT.findAll({
            where: { nft_owner }
        });
        return fetchedData;
    } catch (err) {
        throw err;
    };
};

async function sync () {
    await TraitsNFT.sync({ alter: true });
};

//TraitsNFT.destroy({ truncate: true }).then(() => console.log("trait"));

module.exports = { insert, findByNFTOwner, sync };