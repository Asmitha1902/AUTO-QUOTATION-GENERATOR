const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();

const Invoice = require('../models/invoice');
const InvoiceCounter = require('../models/InvoiceCounter');
const generatePDF = require('../utils/pdfGenerator');

// Helper functions
const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const normalizeEnum = (value, validValues, defaultValue) => {
  if (!value) return defaultValue;
  const val = capitalizeFirstLetter(String(value).trim());
  return validValues.includes(val) ? val : defaultValue;
};

const validInvoiceTypes = ['Quotation', 'Estimate'];
const validStatuses = ['Open', 'Paid', 'Overdue'];
const validPaymentStatuses = ['Pending', 'Paid', 'Overdue'];

// Helper to calculate totals with correct field names
const calculateTotals = (invoice) => {
  const subtotal = Array.isArray(invoice.items)
    ? invoice.items.reduce((acc, item) => acc + (Number(item.total) || 0), 0)
    : 0;

  const discount_percent = Number(invoice.discount_percent || invoice.discount) || 0;
  const shipping = Number(invoice.shipping) || 0;
  const tax_percent = Number(invoice.tax_percent || invoice.tax) || 0;
  const removeTax = invoice.removeTax || false;

  const discountAmount = (subtotal * discount_percent) / 100;
  const taxAmount = removeTax ? 0 : ((subtotal - discountAmount) * tax_percent) / 100;

  const order_total_after_tax = Math.round((subtotal - discountAmount + shipping + taxAmount) * 100) / 100;

  return {
    sub_total: subtotal,
    discount_percent,
    shipping,
    tax_percent,
    removeTax,
    order_total_after_tax,
  };
};

// Generate PDF for invoice
router.get('/:id/pdf', async (req, res) => {
  const invoiceId = req.params.id;

  if (!mongoose.isValidObjectId(invoiceId)) {
    return res.status(400).send('Invalid invoice ID');
  }

  try {
    const invoice = await Invoice.findById(invoiceId).populate('customer').lean();
    if (!invoice) return res.status(404).send('Invoice not found');

    const logoPath = path.join(__dirname, '../assets/logo.png');
    generatePDF(invoice, logoPath, res);
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).send('Error generating PDF');
  }
});

// List all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer', 'customer_name')
      .sort({ createdAt: -1 })
      .lean();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' });
  }

  try {
    const invoice = await Invoice.findById(id).populate('customer', 'customer_name').lean();
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoice', error: err.message });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  try {
    // Normalize enums
    req.body.invoice_type = normalizeEnum(req.body.invoice_type, validInvoiceTypes, 'Quotation');
    req.body.status = normalizeEnum(req.body.status, validStatuses, 'Open');
    req.body.payment_status = normalizeEnum(req.body.payment_status, validPaymentStatuses, 'Pending');

    // Generate sequential invoice number
    const counter = await InvoiceCounter.findOneAndUpdate(
      { _id: 'invoice_counter' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    req.body.invoice_number = counter.seq;

    // Calculate totals with proper fields
    const totals = calculateTotals(req.body);
    Object.assign(req.body, totals);

    const invoice = new Invoice(req.body);
    await invoice.save();

    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create invoice', error: err.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' });
  }

  try {
    // Normalize enums
    req.body.invoice_type = normalizeEnum(req.body.invoice_type, validInvoiceTypes, 'Quotation');
    req.body.status = normalizeEnum(req.body.status, validStatuses, 'Open');
    req.body.payment_status = normalizeEnum(req.body.payment_status, validPaymentStatuses, 'Pending');

    // Recalculate totals before update
    const totals = calculateTotals(req.body);
    Object.assign(req.body, totals);

    const invoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update invoice', error: err.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' });
  }

  try {
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete invoice', error: err.message });
  }
});

module.exports = router;
