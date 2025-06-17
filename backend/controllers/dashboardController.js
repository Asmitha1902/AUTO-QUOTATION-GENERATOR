const Invoice = require('../models/invoice');
const Product = require('../models/product');
const Customer = require('../models/customer');

exports.getSalesTotal = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvoiceCount = async (req, res) => {
  try {
    const total = await Invoice.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingBillsCount = async (req, res) => {
  try {
    const total = await Invoice.countDocuments({ status: "Pending" });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalDueAmount = async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: "Pending" });
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductCount = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomerCount = async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
