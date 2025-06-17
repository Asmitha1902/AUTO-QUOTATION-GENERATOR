const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateInvoicePDF(invoiceData, logoPath, res) {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${invoiceData.invoiceNumber || 'invoice'}.pdf`);
  doc.pipe(res);

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return `Rs. ${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercent = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const {
    invoiceNumber = '',
    invoiceDate = '',
    dueDate = '',
    customer = {},
    items = [],
    subtotal = 0,
    discount = 0,
    shipping = 0,
    tax = 0,
    removeTax = false,
    grandTotal = 0,
  } = invoiceData;

  // Logo
  if (logoPath && fs.existsSync(logoPath)) {
    doc.image(logoPath, (doc.page.width - 150) / 2, 10, { width: 150 });
  }

  // Header
  doc.font('Helvetica-Bold').fontSize(18).text('SRIDATT INFOTECH', { align: 'center' });
  doc.font('Helvetica').fontSize(12).text('AUTO QUOTATION GENERATOR', { align: 'center' });
  doc.moveDown();

  // Invoice Info
  doc.fontSize(14).font('Helvetica-Bold').text('INVOICE');
  doc.font('Helvetica').fontSize(11);
  doc.text(`REFERENCE: ${invoiceNumber}`);
  doc.text(`BILLING DATE: ${invoiceDate}`);
  doc.text(`DUE DATE: ${dueDate}`);
  doc.moveDown();

  // Column Setup
  const col1X = 40;
  const col2X = 230;
  const col3X = 420;
  const startY = doc.y;

  // OUR INFO
  doc.font('Helvetica-Bold').text('OUR INFORMATION', col1X, startY);
  doc.font('Helvetica').fontSize(10);
  doc.text('Sridatta Infotech', col1X, startY + 15);
  doc.text('H.NO:24-804/2', col1X, startY + 30);
  doc.text('Panchasheela colony IDPL', col1X, startY + 45);
  doc.text('Balanagar', col1X, startY + 60);
  doc.text('HYD, Telangana', col1X, startY + 75);
  doc.text('500037', col1X, startY + 90);
  doc.text('Company No: 8686990882', col1X, startY + 105);

  // BILLING TO
  doc.font('Helvetica-Bold').text('BILLING TO', col2X, startY);
  doc.font('Helvetica').fontSize(10);
  doc.text(customer.customer_name || '', col2X, startY + 15);
  doc.text(customer.customer_address_1 || '', col2X, startY + 30);
  doc.text(customer.customer_address_2 || '', col2X, startY + 45);
  doc.text(customer.customer_town || '', col2X, startY + 60);
  doc.text(customer.customer_county || '', col2X, startY + 75);
  doc.text(customer.customer_pincode || '', col2X, startY + 90);
  doc.text(`Phone: ${customer.customer_phone || ''}`, col2X, startY + 105);

  // SHIPPING TO
  doc.font('Helvetica-Bold').text('SHIPPING TO', col3X, startY);
  doc.font('Helvetica').fontSize(10);
  doc.text(customer.customer_name_ship || '', col3X, startY + 15);
  doc.text(customer.customer_address_1_ship || '', col3X, startY + 30);
  doc.text(customer.customer_address_2_ship || '', col3X, startY + 45);
  doc.text(customer.customer_town_ship || '', col3X, startY + 60);
  doc.text(customer.customer_county_ship || '', col3X, startY + 75);
  doc.text(customer.customer_pincode_ship || '', col3X, startY + 90);

  doc.moveDown(3);

  // Table headers
  const tableTop = doc.y + 10;
  doc.font('Helvetica-Bold').fontSize(12);
  doc.text('PRODUCT', col1X, tableTop);
  doc.text('PRICE', col2X, tableTop, { align: 'right' });
  doc.text('QUANTITY', col2X + 100, tableTop, { align: 'right' });
  doc.text('SUBTOTAL', col3X, tableTop, { align: 'right' });
  doc.moveTo(col1X, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  // Table rows
  let y = tableTop + 25;
  doc.font('Helvetica').fontSize(11);
  items.forEach(({ description, price, quantity, total }) => {
    doc.text(description || 'N/A', col1X, y);
    doc.text(formatCurrency(price), col2X, y, { align: 'right' });
    doc.text(quantity?.toString() || '0', col2X + 100, y, { align: 'right' });
    doc.text(formatCurrency(total), col3X, y, { align: 'right' });
    y += 20;
  });

  y += 10;

  // Totals section
  const totalStartX = col2X + 100;
  doc.font('Helvetica-Bold');

  doc.text('Sub Total:', totalStartX, y, { align: 'right' });
  doc.text(formatCurrency(subtotal), col3X, y, { align: 'right' });
  y += 20;

  doc.text('Discount (%):', totalStartX, y, { align: 'right' });
  doc.text(formatPercent(discount), col3X, y, { align: 'right' });
  y += 20;

  doc.text('Shipping:', totalStartX, y, { align: 'right' });
  doc.text(formatCurrency(shipping), col3X, y, { align: 'right' });
  y += 20;

  doc.text('TAX/VAT (%):', totalStartX, y, { align: 'right' });
  doc.text(removeTax ? '0.00' : formatPercent(tax), col3X, y, { align: 'right' });
  y += 30;

  // Grand total highlight
  doc.rect(totalStartX - 10, y - 10, 200, 25).fill('#000');
  doc.fillColor('#fff').font('Helvetica-Bold').text('Grand Total:', totalStartX, y);
  doc.text(formatCurrency(grandTotal), col3X, y, { align: 'right' });
  doc.fillColor('#000');
  y += 40;

  // Payment Info
  doc.font('Helvetica-Bold').fontSize(12).text('PAYMENT INFORMATION', col1X, y);
  y += 20;
  doc.font('Helvetica').fontSize(10);
  doc.text('Sridatta Infotech', col1X, y);
  y += 15;
  doc.text('BANK : THE AP MAHESH COOPERATIVE', col1X, y);
  y += 15;
  doc.text('BANK ACCOUNT NO: 018001200008056', col1X, y);
  y += 15;
  doc.text('IFSC CODE: APMC0000018', col1X, y);

  // Footer
  doc.font('Helvetica-Oblique').fontSize(10).text('Thank you for your business!', 0, doc.page.height - 50, {
    align: 'center',
    width: doc.page.width,
  });

  doc.end();
}

module.exports = generateInvoicePDF;