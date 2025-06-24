const express = require("express");
const { receivePayment } = require("../controllers/payementController");
const router = express.Router();

router.post("/receivePayment", receivePayment);

module.exports = router;
