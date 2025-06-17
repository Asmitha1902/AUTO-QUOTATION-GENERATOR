const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// -----------------------
// GET All Products
// -----------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Optional: sorted by latest
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// -----------------------
// GET Product by ID
// -----------------------
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// -----------------------
// CREATE Product
// -----------------------
router.post('/', async (req, res) => {
  try {
    const { product_name, product_desc = '', product_price } = req.body;

    if (!product_name || product_price === undefined || isNaN(product_price)) {
      return res.status(400).json({
        success: false,
        message: 'Product name and a valid price are required.',
      });
    }

    const newProduct = new Product({
      product_name: product_name.trim(),
      product_desc: product_desc.trim(),
      product_price: parseFloat(product_price),
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product_id: newProduct._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add product: ' + err.message });
  }
});

// -----------------------
// UPDATE Product
// -----------------------
router.put('/:id', async (req, res) => {
  try {
    const { product_name, product_desc, product_price } = req.body;

    const updates = {};
    if (product_name !== undefined) updates.product_name = product_name.trim();
    if (product_desc !== undefined) updates.product_desc = product_desc.trim();
    if (product_price !== undefined && !isNaN(product_price))
      updates.product_price = parseFloat(product_price);

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update: ' + err.message });
  }
});

// -----------------------
// DELETE Product
// -----------------------
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete: ' + err.message });
  }
});

module.exports = router;
