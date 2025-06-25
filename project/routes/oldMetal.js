const express = require("express");
const { addOldGood, getBillList } = require("../controllers/urdPurchase");
const router = express.Router();

router.post("/metterialAdd", addOldGood);
router.get("/", getBillList);

module.exports = router;
