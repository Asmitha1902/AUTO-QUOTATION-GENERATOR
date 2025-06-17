const express = require('express');
const router = express.Router();

const Invoice = require('../models/invoice');
const Product = require('../models/product');
const Customer = require('../models/customer');

// GET: Total Sales
// GET: Total Sales Amount of Paid Invoices
router.get('/sales-amount', async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      { $match: { payment_status: 'Paid' } },

      { $group: { _id: null, totalSales: { $sum: '$order_total_after_tax' } } }
    ]);
    res.json({ totalSales: result[0]?.totalSales || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET: Total Invoices
router.get('/invoice-count', async (req, res) => {
  try {
    const total = await Invoice.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching invoice count' });
  }
});

// GET: Pending Invoices
router.get('/pending-count', async (req, res) => {
  try {
    const total = await Invoice.countDocuments({ payment_status: 'Pending' });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pending invoice count' });
  }
});

// GET: Paid Invoices
router.get('/paid-invoice-count', async (req, res) => {
  try {
    const total = await Invoice.countDocuments({ payment_status: 'Paid' });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching paid invoice count' });
  }
});

// GET: Total Due Amount
router.get('/total-due', async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      { $match: { payment_status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$due_amount' } } }
    ]);
    res.json({ total: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching total due amount' });
  }
});

// GET: Total Products
router.get('/product-count', async (req, res) => {
  try {
    const total = await Product.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product count' });
  }
});

// GET: Total Customers
router.get('/customer-count', async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching customer count' });
  }
});

module.exports = router;