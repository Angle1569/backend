const express = require("express");
const { receivePayment } = require("../controllers/payementController");
const router = express.Router();

router.post("/receive-payment", receivePayment);

module.exports = router;
