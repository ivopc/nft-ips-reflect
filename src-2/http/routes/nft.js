const { Router } = require("express");
const router = Router();
const { generateNFT, fetchNFT } = require("../controllers/nft");

router
    .post("/generate", generateNFT)
    .get("/fetch", fetchNFT);

module.exports = router;