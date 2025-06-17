const mongoose = require('mongoose');

// Schema for individual invoice items
const ItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 }
});

// Schema for customer info (flat object for simplicity)
const CustomerSchema = new mongoose.Schema({
  customer_name: { type: String, default: '' },
  customer_email: { type: String, default: '' },
  customer_address_1: { type: String, default: '' },
  customer_address_2: { type: String, default: '' },
  customer_town: { type: String, default: '' },
  customer_county: { type: String, default: '' },
  customer_pincode: { type: String, default: '' },
  customer_phone: { type: String, default: '' },

  customer_name_ship: { type: String, default: '' },
  customer_address_1_ship: { type: String, default: '' },
  customer_address_2_ship: { type: String, default: '' },
  customer_town_ship: { type: String, default: '' },
  customer_county_ship: { type: String, default: '' },
  customer_pincode_ship: { type: String, default: '' }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  invoice_id: { type: String, required: true, unique: true },  // Internal invoice ID, string
  invoice_number: { type: String, required: true, unique: true }, // e.g. QTN-00001

  type: {
    type: String,
    enum: ['Quotation', 'Estimate'],
    required: true
  },

  customer: {
    type: CustomerSchema,
    required: true
  },

  items: {
    type: [ItemSchema],
    required: true,
    validate: [arrayLimit, '{PATH} must have at least one item']
  },

  sub_total: { type: Number, default: 0 },
  discount_percent: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 },
  tax_percent: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },

  remove_tax: { type: Boolean, default: false },
  order_total_after_tax: { type: Number, default: 0 },

  invoice_date: { type: Date, required: true },
  due_date: { type: Date, required: true },

  status: {
    type: String,
    enum: ['Open', 'Paid', 'Overdue'],
    default: 'Open'
  }

}, { timestamps: true });

function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Invoice', InvoiceSchema);
