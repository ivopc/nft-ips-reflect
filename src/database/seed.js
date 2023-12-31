require("custom-env").env(process.env.NODE_ENV);
const NFTs = require("../../public/images/metadata/metadata.json");

const { insert: insertNFT, sync: syncNFT } = require("./models/NFT");
const { insert: insertTrait, sync: syncTraits } = require("./models/TraitsNFT");
const { sync: syncMint } = require("./models/MintedNFT");

async function insert (nft) {
    const nftInDb = await insertNFT({
        address: "",
        token_id: nft.name.split("#")[1],
        name: "BELP " + nft.name,
        description: nft.description,
        image: "",
    });
    const { id } = nftInDb.dataValues;
    for await (const attr of nft.attributes) {
        await insertTrait({
            nft_owner: id,
            trait_type: attr.trait_type,
            value: attr.value
        })
    };
    console.log(`${nft.name} added!`);
};

async function syncAll () {
    await Promise.all([
        syncNFT(),
        syncTraits(),
        syncMint()
    ]);
};

async function insertAll () {
    for await (const nft of NFTs.collection) {
        await insert(nft);
    };
};

;(async () => {
    await syncAll();
    await insertAll();
    console.log("Done!!!");
})();