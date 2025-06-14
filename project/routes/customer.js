// routes/customerRoutes.js
const express = require("express");
const router = express.Router();

const {
  addCustomer,
  getCustomerList,
  updateCustomer,
} = require("../controllers/customerController");

//Add Customer
router.post("/detail", addCustomer);
router.get("/customerlist", getCustomerList);
router.put("/update/:customId", updateCustomer);

module.exports = router;
