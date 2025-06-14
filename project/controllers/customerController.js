const Customer = require("../models/Customer");
const Counter = require("../models/Counter");

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

async function addCustomer(req, res) {
  try {
    const {
      customerName,
      mobile,
      email,
      address,
      adhaar,
      pancard,
      openbalance,
      paymentmode,
    } = req.body;

    // Required field validation
    if (!mobile || !customerName) {
      return res.status(400).json({
        message: "Customer name and mobile number are required",
        status: false,
      });
    }

    // Check if mobile already exists
    const existingCustomer = await Customer.findOne({ mobile });
    if (existingCustomer) {
      return res.status(409).json({
        message: "Mobile number already exists",
        status: false,
      });
    }

    const customId = await getNextSequence("customerId");

    // Save new customer
    const newCustomer = new Customer({
      customId,
      customerName,
      mobile,
      email,
      address,
      adhaar,
      pancard,
      openbalance,
      paymentmode,
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer added successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({
      message: "Failed to add customer",
      status: false,
    });
  }
}

async function getCustomerList(req, res) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      $or: [
        { customerName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ],
    };

    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    res.status(200).json({
      data: customers,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(404).json({ message: "No record found " });
  }
}

async function updateCustomer(req, res) {
  try {
    const id = parseInt(req.params.customId);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid customId format" });
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { customId: id },
      req.body,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      status: true,
      updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({
      message: "Failed to update customer",
      status: false,
      error: error.message,
    });
  }
}

module.exports = {
  addCustomer,
  getCustomerList,
  updateCustomer,
};
