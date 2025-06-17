const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  customer_email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
    // optional: make email required if you want:
    // required: [true, 'Customer email is required']
  },
  customer_phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9\s\-]{7,20}$/, 'Invalid phone number format']
  },
  customer_address_1: { type: String, trim: true },
  customer_address_2: { type: String, trim: true },
  customer_town: { type: String, trim: true },
  customer_county: { type: String, trim: true },
  customer_postcode: { type: String, trim: true },

  customer_name_ship: { type: String, trim: true },
  customer_address_1_ship: { type: String, trim: true },
  customer_address_2_ship: { type: String, trim: true },
  customer_town_ship: { type: String, trim: true },
  customer_county_ship: { type: String, trim: true },
  customer_postcode_ship: { type: String, trim: true }
}, {
  timestamps: true
});

// Pre-save hook: copy billing info to shipping if shipping info is empty
customerSchema.pre('save', function(next) {
  if (!this.customer_name_ship) this.customer_name_ship = this.customer_name;
  if (!this.customer_address_1_ship) this.customer_address_1_ship = this.customer_address_1;
  if (!this.customer_address_2_ship) this.customer_address_2_ship = this.customer_address_2;
  if (!this.customer_town_ship) this.customer_town_ship = this.customer_town;
  if (!this.customer_county_ship) this.customer_county_ship = this.customer_county;
  if (!this.customer_postcode_ship) this.customer_postcode_ship = this.customer_postcode;
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
