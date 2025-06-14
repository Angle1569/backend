const express = require("express");
const { addOldGood, getBillList, getBillId } = require("../controllers/oldMetal");
const router = express.Router();

router.post("/metterialAdd", addOldGood);
router.get("/", getBillList);
router.get("/next-bill-no", getBillId);

module.exports = router;
