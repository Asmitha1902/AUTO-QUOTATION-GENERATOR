require('dotenv').config();
const { MongoClient } = require('mongodb');

// Create MongoClient without deprecated options
const client = new MongoClient(process.env.MONGO_URL);

let db;
let collections = {};

async function connectToMongo() {
  try {
    await client.connect();
    // Use your actual DB name exactly as it appears in Atlas
    db = client.db('Real time project(1)');

    collections = {
      users: db.collection('users'),
      products: db.collection('products'),
      invoices: db.collection('invoices'),
      customers: db.collection('customers'),
    };

    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

function getCollections() {
  return collections;
}

module.exports = { connectToMongo, getCollections };
