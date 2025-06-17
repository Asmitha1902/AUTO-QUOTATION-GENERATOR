const { ObjectId } = require('mongodb');
const { getCollections } = require('../db/mongo');

// ------------------------------
// Create Product
// ------------------------------
exports.createProduct = async (req, res) => {
  try {
    const { products: productsCollection } = getCollections();

    const { product_name, product_desc = '', product_price } = req.body;

    if (!product_name || product_price == null) {
      return res.status(400).json({ success: false, message: 'Product name and price are required' });
    }

    const newProduct = {
      product_name,
      product_desc,
      product_price,
    };

    const result = await productsCollection.insertOne(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product_id: result.insertedId.toString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Get All Products
// ------------------------------
exports.getAllProducts = async (req, res) => {
  try {
    const { products: productsCollection } = getCollections();

    const products = await productsCollection.find().toArray();
    products.forEach(product => {
      product._id = product._id.toString();
    });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Get Product by ID
// ------------------------------
exports.getProductById = async (req, res) => {
  try {
    const { products: productsCollection } = getCollections();

    const productId = req.params.productId;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product._id = product._id.toString();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Update Product
// ------------------------------
exports.updateProduct = async (req, res) => {
  try {
    const { products: productsCollection } = getCollections();

    const productId = req.params.productId;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const { product_name, product_desc, product_price } = req.body;

    const updateFields = {};
    if (product_name) updateFields.product_name = product_name;
    if (product_desc) updateFields.product_desc = product_desc;
    if (product_price != null) updateFields.product_price = product_price;

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Delete Product
// ------------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const { products: productsCollection } = getCollections();

    const productId = req.params.productId;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
