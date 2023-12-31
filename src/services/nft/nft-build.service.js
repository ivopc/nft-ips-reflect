require("custom-env").env(process.env.NODE_ENV);
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const Moralis = require("moralis/node");

const getMoralis = require("./MoralisConnection");
const { 
    insert: insertMintedNFT, 
    alreadyExists: mintedNFTAlreadyExists 
} = require("../../database/models/MintedNFT");
const {  update: updateNFT } = require("../../database/models/NFT");
const Logger = require("../../database/models/Logger");

/**
 * @type {import("@pinata/sdk").PinataClient}
 */
const pinata = require("@pinata/sdk")(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

require("../../typedef/NFT");

/**
 * 
 * @param {Array<string>} addresses
 * @returns {Array<{image:import("@pinata/sdk").PinataPinResponse,json:import("@pinata/sdk").PinataPinResponse}>}
 */
async function buildFromList (addresses) {
    const response = [];
    for await (const address of addresses) {
        const nft = await build(address);
        response.push(nft);
    };
    return response;
};

/**
 * 
 * @param {string} txhash Transaction hash 
 * @returns 
 */
async function build (txhash) {
    try {
        const { from_address, to_address, logs } = await getTransaction({ transaction_hash: txhash, chain: process.env.NFT_CHAIN });
        const operations = await getNFTTransfers({ address: from_address, chain: process.env.NFT_CHAIN });
        const { token_id, token_address } = operations.result[0];
        if (token_address !== to_address) {
            throw new Error("Isn't the same contract");
        };
        if (await mintedNFTAlreadyExists(txhash)) {
            throw new Error("NFT is already minted");
        };
        const image = await pinImageNFT(token_id);
        const json = await pinJSONNFT(token_id);
        await registerMintedNFT({
            transaction_hash: logs[0].transaction_hash,
            from_address,
            token_id,
            ipfs: {
                image: {
                    hash: image.IpfsHash,
                    timestamp: image.Timestamp
                },
                json: {
                    hash: json.IpfsHash,
                    timestamp: json.Timestamp
                }
            }
        });
        await updateNFT(token_id, {
            token_id,
            image: `ipfs://${image.IpfsHash}/${token_id}.webp`,
            address: from_address
        });
        return { image, json };
    } catch (err) {
        throw err;
    };
};

/**
 * 
 * @param {TransactionInput} transactionInput 
 * @returns 
 */
async function getTransaction (transactionInput) {
    const { transaction_hash, chain } = transactionInput;
    try {
        await getMoralis();
        const nftTransfers = await Moralis.Web3API.native.getTransaction({ transaction_hash, chain });
        if (!isTransactionValid(nftTransfers))
            throw new Error("Invalid transaction!");
        return nftTransfers;
    } catch (err) {
        Logger.error(err);
        throw err;
    };
};

/**
 * 
 * @param {TransferInput} transferInput 
 * @returns 
 */
async function getNFTTransfers (transferInput) {
    const { address, chain } = transferInput;
    try {
        await getMoralis();
        const transferData = await Moralis.Web3API.account.getNFTTransfers({ address, chain });
        return transferData;
    } catch (err) {
        Logger.error(err);
        throw err;
    };
};

async function pinImageNFT (token_id) {
    try {
        const data = await pinata.pinFileToIPFS(getNFTImageFile(token_id));
        return data;
    } catch (err) {
        throw err;
    };
};

async function pinJSONNFT (token_id) {
    try {
        const file = await promisify(fs.readFile)(getNFTJSONFilePath(token_id));
        const json = await pinata.pinJSONToIPFS(JSON.parse(file));
        return json;
    } catch (err) {
        throw err;
    };
};

async function registerMintedNFT ({ transaction_hash, from_address, token_id, ipfs }) {
    try {
        await insertMintedNFT({ transaction_hash, from_address, token_id, ipfs });
    } catch (err) {
        throw err;
    };
};

const getNFTImageFile = id => fs.createReadStream(path.join(__dirname, "..", "..","..", "public", "images", "assets", id + ".webp"));

const getNFTJSONFilePath = id => path.join(__dirname, "..", "..", "..", "public", "images", "metadata", id + ".json");

/**
 * @helpers
 */

const isTransactionValid = transaction => 
    transaction.receipt_status === "1" &&
    transaction.to_address === process.env.NFT_CONTRACT_ADDRESS;

module.exports = buildFromList;

/*const options = {
  chain: process.env.NFT_CHAIN,
  token_address: process.env.NFT_CONTRACT_ADDRESS,
  address: process.env.NFT_CONTRACT_ADDRESS,
  limit: "5",
};
;(async () => {
    try {
        await getMoralis();
        const options2 = {
            address: process.env.NFT_CONTRACT_ADDRESS,
            chain: process.env.NFT_CHAIN,
        };
        const nftOwners = await Moralis.Web3API.token.getNFTOwners(options2);
        console.log("nftOwners", nftOwners.result.find(nft => nft.token_id === "5"));
        const transfersNFT = await Moralis.Web3API.account.getNFTTransfers(options);
        console.log("transfersNFT");
        console.log(transfersNFT);
    } catch (err) {
        console.error(err);
    }
})();*/