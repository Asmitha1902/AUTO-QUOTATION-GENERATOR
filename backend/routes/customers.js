const express = require('express');
const router = express.Router();
const Customer = require('../models/customer'); // Mongoose model for Customer

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      customer_id: savedCustomer._id.toString(),
    });
  } catch (err) {
    console.error("Create customer error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error("Fetch customers error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get one customer by ID
router.get('/:customerId', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error("Get customer by ID error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update a customer by ID
router.put('/:customerId', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a customer by ID
router.delete('/:customerId', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error("Delete customer error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
