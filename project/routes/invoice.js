const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoiceList,
} = require("../controllers/invoiceController");

router.post("/invoice_gent", createInvoice);
router.get("/get_invoice", getInvoiceList);

module.exports = router;
