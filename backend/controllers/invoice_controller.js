const { ObjectId } = require('mongodb');
const { getCollections } = require('../db/mongo');

// ------------------------------
// Create Invoice
// ------------------------------
exports.createInvoice = async (req, res) => {
  try {
    const { invoices: invoicesCollection } = getCollections();
    const data = req.body;

    if (!data.customer_id || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid invoice data' });
    }

    const invoiceDate = data.invoice_date ? new Date(data.invoice_date) : new Date();
    const dueDate = data.due_date
      ? new Date(data.due_date)
      : new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

    const invoice = {
      customer_id: new ObjectId(data.customer_id),
      invoice_date: invoiceDate,
      due_date: dueDate,
      items: data.items,
      status: data.status || 'pending',
      total_amount: data.total_amount || 0,
      notes: data.notes || '',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await invoicesCollection.insertOne(invoice);

    return res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice_id: result.insertedId.toString(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Get All Invoices (with pagination)
// ------------------------------
exports.getAllInvoices = async (req, res) => {
  try {
    const { invoices: invoicesCollection } = getCollections();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const invoices = await invoicesCollection.find().skip(skip).limit(limit).toArray();
    const totalCount = await invoicesCollection.countDocuments();

    invoices.forEach(inv => {
      inv._id = inv._id.toString();
      inv.customer_id = inv.customer_id.toString();
    });

    return res.json({
      success: true,
      invoices,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Get Invoice by ID
// ------------------------------
exports.getInvoiceById = async (req, res) => {
  try {
    const { invoices: invoicesCollection } = getCollections();
    const invoiceId = req.params.invoiceId;

    if (!ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid invoice ID' });
    }

    const invoice = await invoicesCollection.findOne({ _id: new ObjectId(invoiceId) });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice._id = invoice._id.toString();
    invoice.customer_id = invoice.customer_id.toString();

    return res.json({ success: true, invoice });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Update Invoice
// ------------------------------
exports.updateInvoice = async (req, res) => {
  try {
    const { invoices: invoicesCollection } = getCollections();
    const invoiceId = req.params.invoiceId;

    if (!ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid invoice ID' });
    }

    const data = req.body;

    const updatedData = {
      ...(data.customer_id && { customer_id: new ObjectId(data.customer_id) }),
      ...(data.invoice_date && { invoice_date: new Date(data.invoice_date) }),
      ...(data.due_date && { due_date: new Date(data.due_date) }),
      ...(data.items && { items: data.items }),
      ...(data.status && { status: data.status }),
      ...(data.total_amount != null && { total_amount: data.total_amount }),
      ...(data.notes && { notes: data.notes }),
      updated_at: new Date(),
    };

    const result = await invoicesCollection.updateOne(
      { _id: new ObjectId(invoiceId) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    return res.json({ success: true, message: 'Invoice updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------
// Delete Invoice
// ------------------------------
exports.deleteInvoice = async (req, res) => {
  try {
    const { invoices: invoicesCollection } = getCollections();
    const invoiceId = req.params.invoiceId;

    if (!ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid invoice ID' });
    }

    const result = await invoicesCollection.deleteOne({ _id: new ObjectId(invoiceId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    return res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
