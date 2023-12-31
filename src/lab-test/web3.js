const Moralis = require("moralis/node");

// 

/*const txOptions = {
    type: "erc20",
    amount: Moralis.Units.Token("10","18"),
    receiver:   "0xB5…ee035",
    contractAddress: "0x7b…605e",
    awaitReceipt: false // should be switched to false
    }
  
   const tx = await Moralis.transfer (txOptions);
  
   tx.on("transactionHash", (hash) => {…})
     .on ("receipt", (receipt) => {…})
     .on ("confirmation", (confirnationNumber, receipt) => { ... })
     .on ("error", (error) => {…})*/
    const serverUrl = "https://qugkegnpnnm4.usemoralis.com:2053/server";
    const appId = "";
    const masterKey = "";

const option = {
  transaction_hash: "0xf2c0a9bc5ac7403c41079277e3aef5a25f086892a9bf748653c20f1a18ed0068",
  chain: "0x61"
};




(async () => {
  await Moralis.start({ serverUrl, appId, masterKey });
  const nftTransfers = await Moralis.Web3API.native.getTransaction(option);
  // receipt_status tem que ser igual a '1' para confirmar a transaction e '0' ele falou
  // to adress tem que ser sempre '0xbc658b6914377c76634a864f10910c46e6f31c8a'
  // pegar 'from_address' é carteira q vai gerar o NFT para pegar para pegar o 'token_id'
  console.log(nftTransfers);

  const option2 = {
    "address": "0x84F6fBF0b9439Ea3968dd5c39FEb1741794EA47c",
    chain: "0x61"
  }
  const c = await Moralis.Web3API.account.getNFTTransfers(option2);
  console.log(c);
  /**
   * pegar `token_id` e guardar e vincular com o `from_address` do `getTransaction`
   * `token_address` tem que ser igual ao  `to_address` do getTransaction
   * 
   * 
   * /

  // subir o arquivo referente ao token id no IPFS


})();


/// https://docs.moralis.io/moralis-dapp/web3-api/native#gettransaction-new

// https://docs.pinata.cloud/nfts#how-to-upload-your-asset-with-pinata 

//// https://docs.moralis.io/moralis-dapp/files/ipfs
