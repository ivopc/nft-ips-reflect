async function fetchWaitingNFTsBefore (token_id) {
    const tokens_id = await findMinorThanAndNotMinted(token_id);
    await mintWaitingNFTs(tokens_id);
};

/**
 * 
 * @param {Array<string>} tokens_id 
 */
async function mintWaitingNFTs (tokens_id) {
    try {
        await getMoralis();
        const nftOwners = (await Moralis.Web3API.token.getNFTOwners({
            address: process.env.NFT_CONTRACT_ADDRESS,
            chain: process.env.NFT_CHAIN
        })).result.filter(nft => tokens_id.includes(nft.token_id));
        for await (const nftOwner of nftOwners) {
            const transfers = await Moralis.Web3API.account.getNFTTransfers({
                chain: process.env.NFT_CHAIN,
                address: nftOwner.owner_of
            });
            const { transaction_hash } = transfers.result.find(transfer => transfer.token_id === nftOwner.token_id);
            await build(transaction_hash);
        };
    } catch (err) {
        console.error(err);
    };
};

module.exports = { fetchWaitingNFTsBefore };

/**
 * @type {import("moralis/node").default}
 */
 const Moralis = require("moralis/node");
 const getMoralis = require("./MoralisConnection");
 
 const build = require("./nft-build.service");
 
 const { findMinorThanAndNotMinted } = require("../../database/models/NFT");