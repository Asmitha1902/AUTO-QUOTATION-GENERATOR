const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.post('/export-temp-preview', async (req, res) => {
  // Use hardcoded data for testing:
  const invoiceData = {
    customer: {
      customer_name: 'John Doe',
      customer_address_1: '123 Main St',
      customer_address_2: 'Apt 4B',
      customer_town: 'Cityville',
      customer_county: 'State',
      customer_pincode: '123456'
    },
    invoice_number: 'INV-001',
    invoice_date: '2025-06-04',
    due_date: '2025-06-10',
    items: [
      { description: 'Product A', quantity: 2, price: 100, total: 200 },
      { description: 'Product B', quantity: 1, price: 50, total: 50 }
    ],
    subtotal: 250,
    total: 295,
  };

  try {
    const templatePath = path.join(__dirname, '../templates/invoiceTemplate.ejs');
    const html = await ejs.renderFile(templatePath, { invoice: invoiceData });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    // Save PDF to file for debugging
    fs.writeFileSync('test-invoice.pdf', pdfBuffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="invoice.pdf"',
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;
