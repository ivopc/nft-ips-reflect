const NFTs = require("../../public/images/metadata/metadata.json");

/*const { insert: insertNFT } = require("./models/NFT");
const { insert: insertTrait } = require("./models/TraitsNFT");*/

const [ firstOne ] = NFTs.collection;

console.log(firstOne);