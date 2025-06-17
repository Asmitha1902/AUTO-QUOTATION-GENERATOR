const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  product_desc: {
    type: String,
    default: '',
    trim: true
  },
  product_price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Product', productSchema);
