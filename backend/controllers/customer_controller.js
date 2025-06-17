const { ObjectId } = require('mongodb');
const { getCollections } = require('../db/mongo');

// ------------------------------
// Create Customer
// ------------------------------
exports.createCustomer = async (req, res) => {
  try {
    const { customers: customersCollection } = getCollections(); // ✅ moved inside
    const data = req.body;

    if (!data.customer_name || !data.customer_email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const customer = {
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone || '',
      customer_address_1: data.customer_address_1 || '',
      customer_address_2: data.customer_address_2 || '',
      customer_town: data.customer_town || '',
      customer_county: data.customer_county || '',
      customer_postcode: data.customer_postcode || '',
      customer_name_ship: data.customer_name_ship || '',
      customer_address_1_ship: data.customer_address_1_ship || '',
      customer_address_2_ship: data.customer_address_2_ship || '',
      customer_town_ship: data.customer_town_ship || '',
      customer_county_ship: data.customer_county_ship || '',
      customer_postcode_ship: data.customer_postcode_ship || '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await customersCollection.insertOne(customer);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      customer_id: result.insertedId.toString()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Get All Customers
// ------------------------------
exports.getAllCustomers = async (req, res) => {
  try {
    const { customers: customersCollection } = getCollections(); // ✅
    const customers = await customersCollection.find().toArray();
    customers.forEach(c => c._id = c._id.toString());
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Get Customer by ID
// ------------------------------
exports.getCustomerById = async (req, res) => {
  try {
    const { customers: customersCollection } = getCollections(); // ✅
    const customerId = req.params.customerId;

    if (!ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID' });
    }

    const customer = await customersCollection.findOne({ _id: new ObjectId(customerId) });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer._id = customer._id.toString();
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Update Customer
// ------------------------------
exports.updateCustomer = async (req, res) => {
  try {
    const { customers: customersCollection } = getCollections(); // ✅
    const customerId = req.params.customerId;
    const data = req.body;

    if (!ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID' });
    }

    const updatedData = {
      ...(data.customer_name && { customer_name: data.customer_name }),
      ...(data.customer_email && { customer_email: data.customer_email }),
      ...(data.customer_phone && { customer_phone: data.customer_phone }),
      ...(data.customer_address_1 && { customer_address_1: data.customer_address_1 }),
      ...(data.customer_address_2 && { customer_address_2: data.customer_address_2 }),
      ...(data.customer_town && { customer_town: data.customer_town }),
      ...(data.customer_county && { customer_county: data.customer_county }),
      ...(data.customer_postcode && { customer_postcode: data.customer_postcode }),
      ...(data.customer_name_ship && { customer_name_ship: data.customer_name_ship }),
      ...(data.customer_address_1_ship && { customer_address_1_ship: data.customer_address_1_ship }),
      ...(data.customer_address_2_ship && { customer_address_2_ship: data.customer_address_2_ship }),
      ...(data.customer_town_ship && { customer_town_ship: data.customer_town_ship }),
      ...(data.customer_county_ship && { customer_county_ship: data.customer_county_ship }),
      ...(data.customer_postcode_ship && { customer_postcode_ship: data.customer_postcode_ship }),
      updated_at: new Date()
    };

    const result = await customersCollection.updateOne(
      { _id: new ObjectId(customerId) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Delete Customer
// ------------------------------
exports.deleteCustomer = async (req, res) => {
  try {
    const { customers: customersCollection } = getCollections(); // ✅
    const customerId = req.params.customerId;

    if (!ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID' });
    }

    const result = await customersCollection.deleteOne({ _id: new ObjectId(customerId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
