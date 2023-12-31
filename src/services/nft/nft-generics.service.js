const { findByTokenId: findNFTByTokenId } = require("../../database/models/NFT");
const { findByNFTOwner: findTraitsByNFTOwner } = require("../../database/models/TraitsNFT");
//const { findByTokenId: findMinted } = require("../../database/models/MintedNFT");

/**
 * 
 * @param {Array<string>} tokensIds
 */
async function fetchNFTFromList (tokensIds) {
    return await Promise.all(tokensIds.map(tokenId => fetchNFT(tokenId)));
};

async function fetchNFT (tokenId) {
    try {
        const nft = await findNFTByTokenId(tokenId);
        if (!nft)
            throw new Error("NFT does not exists");
        const { id, name, description, external_url, image, compiler } = nft.dataValues;
        const attributes = (await findTraitsByNFTOwner(id))
            .map(({ dataValues }) => dataValues)
            .map(({ trait_type, value }) => ({ trait_type, value }));
        return { name, description, external_url, image, attributes, compiler };
    } catch (err) {
        throw err;
    };
};

module.exports = { fetchNFTFromList };