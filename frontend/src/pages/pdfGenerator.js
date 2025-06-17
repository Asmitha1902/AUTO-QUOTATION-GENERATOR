import { jsPDF } from "jspdf";
import "jspdf-autotable";

import logo from "../assets/images/sridatt_logo.png";
const PAGE_WIDTH = 210; // A4 width in mm
const LOGO_WIDTH = 150;
const LOGO_HEIGHT = 20;

// Currency formatter
const formatCurrency = (value) => {
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "Rs. 0.00";

  return `Rs. ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const sanitizeNumber = (value) => {
  return parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
};

export const generatePDF = (invoice) => {
  try {
    const {
      invoice_number,
      invoice_date,
      due_date,
      customer,
      items,
      discount = 0,
      shipping = 0,
      tax = 0,
      removeTax = false
    } = invoice;

    const doc = new jsPDF();

    const logoX = (PAGE_WIDTH - LOGO_WIDTH) / 2;
    doc.addImage(logo, "PNG", logoX, 10, LOGO_WIDTH, LOGO_HEIGHT);

    doc.setFontSize(12);
    doc.text("AUTO QUOTATION GENERATOR", 105, 42, { align: "center" });

    doc.setFontSize(11);
    doc.text(`REFERENCE: ${invoice_number || "-"}`, 14, 62);
    doc.text(`BILLING DATE: ${invoice_date || "-"}`, 14, 68);
    doc.text(`DUE DATE: ${due_date || "-"}`, 14, 74);

    // Our Info
    doc.text("OUR INFORMATION", 14, 84);
    doc.text("Sridatta Infotech", 14, 90);
    doc.text("H.NO:24-804/2", 14, 96);
    doc.text("Panchasheela colony IDPL", 14, 102);
    doc.text("Balanagar", 14, 108);
    doc.text("HYD,Telangana", 14, 114);
    doc.text("500037", 14, 120);
    doc.text("Company No: 8686990882", 14, 126);

    // Billing Info
    doc.text("BILLING TO", 80, 84);
    doc.text(customer?.customer_name || "", 80, 90);
    doc.text(customer?.customer_address_1 || "", 80, 96);
    doc.text(customer?.customer_address_2 || "", 80, 102);
    doc.text(customer?.customer_town || "", 80, 108);
    doc.text(customer?.customer_county || "", 80, 114);
    doc.text(customer?.customer_pincode || "", 80, 120);
    doc.text(`Phone: ${customer?.customer_phone || ""}`, 80, 126);

    // Shipping Info
    doc.text("SHIPPING TO", 150, 84);
    doc.text(customer?.customer_name_ship || "", 150, 90);
    doc.text(customer?.customer_address_1_ship || "", 150, 96);
    doc.text(customer?.customer_address_2_ship || "", 150, 102);
    doc.text(customer?.customer_town_ship || "", 150, 108);
    doc.text(customer?.customer_county_ship || "", 150, 114);
    doc.text(customer?.customer_pincode_ship || "", 150, 120);

    // Products Table
    doc.autoTable({
      startY: 135,
      head: [["PRODUCT", "PRICE", "QUANTITY", "SUBTOTAL"]],
      body: items?.map(item => [
        item.description || "Unnamed",
        formatCurrency(sanitizeNumber(item.price)),
        String(item.quantity),
        formatCurrency(sanitizeNumber(item.total)),
      ]) || [],
      theme: "grid",
      styles: {
        fontSize: 12,
        font: "helvetica",
        textColor: 50,
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    });

    const subtotal = items.reduce((sum, item) => sum + sanitizeNumber(item.total), 0);
    const discountAmount = subtotal * (discount / 100);
    const taxableAmount = subtotal - discountAmount + sanitizeNumber(shipping);
    const taxAmount = removeTax ? 0 : taxableAmount * (tax / 100);
    const grandTotal = taxableAmount + taxAmount;

    const endY = doc.lastAutoTable.finalY + 5;

    doc.autoTable({
      startY: endY,
      body: [
        ["Sub Total", formatCurrency(subtotal)],
        ["Discount(%)", `${discount.toFixed(2)}`],
        ["Shipping", formatCurrency(sanitizeNumber(shipping))],
        ["TAX/VAT(%)", removeTax ? "0.00" : tax.toFixed(2)],
        ["Grand Total", formatCurrency(grandTotal)],
      ],
      theme: "grid",
      styles: {
        fontSize: 11,
        font: "helvetica",
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 55, halign: "right" },
      },
      tableWidth: "wrap",
      margin: { left: 110 },
      didParseCell: function (data) {
        if (data.row.index === 4) {
          data.cell.styles.fillColor = [0, 0, 0];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    const finalY = doc.lastAutoTable.finalY + 35;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("PAYMENT INFORMATION", 14, finalY);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Sridatta Infotech", 14, finalY + 6);
    doc.text("BANK : THE AP MAHESH COOPERATIVE", 14, finalY + 12);
    doc.text("BANK ACCOUNT NO: 018001200008056", 14, finalY + 18);
    doc.text("IFSC CODE: APMC0000018", 14, finalY + 24);

    doc.save(`Quotation_${invoice_number || "quotation"}.pdf`);
    console.log("✅ PDF generated and saved");
  } catch (error) {
    console.error("❌ PDF generation failed:", error);
    alert("Error generating PDF. Check console for details.");
  }
};
