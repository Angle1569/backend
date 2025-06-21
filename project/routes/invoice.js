const express = require("express");
const router = express.Router();
const { createInvoice } = require("../controllers/invoiceController");

router.post("/invoice_gent", createInvoice);

module.exports = router;
