import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import { Card as RBCard, Form as RBForm, Button as RBButton } from "react-bootstrap";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import logo from "../assets/images/sridatt_logo.png";



const InvoiceCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([
    { product: null, description: "", quantity: 1, price: 0, total: 0 },
  ]);
  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_email: "",
    customer_address_1: "",
    customer_address_2: "",
    customer_town: "",
    customer_county: "",
    customer_pincode: "",
    customer_phone: "",
    customer_name_ship: "",
    customer_address_1_ship: "",
    customer_address_2_ship: "",
    customer_town_ship: "",
    customer_county_ship: "",
    customer_pincode_ship: "",
  });

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceType, setInvoiceType] = useState("Quotation");
  const [status, setStatus] = useState("Open");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [removeTax, setRemoveTax] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.selectedCustomer) {
      setCustomer(location.state.selectedCustomer);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectExistingCustomer = () => {
    navigate("/customers", { state: { fromInvoiceCreate: true } });
  };

  const productOptions = products.map((p) => ({
    value: p._id,
    label: p.product_name,
    price: p.product_price,
  }));

  const updateRowTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return quantity * price;
  };

  const handleProductChange = (index, selectedOption) => {
    const updatedItems = [...invoiceItems];
    if (selectedOption) {
      updatedItems[index] = {
        ...updatedItems[index],
        product: selectedOption.value,
        description: selectedOption.label,
        price: selectedOption.price,
        quantity: 1,
        total: selectedOption.price,
      };
    } else {
      updatedItems[index] = {
        product: null,
        description: "",
        price: 0,
        quantity: 1,
        total: 0,
      };
    }
    setInvoiceItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index][field] = value;
    updatedItems[index].total = updateRowTotal(updatedItems[index]);
    setInvoiceItems(updatedItems);
  };

  const addProductRow = () => {
    setInvoiceItems((prev) => [
      ...prev,
      { product: null, description: "", quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeProductRow = (index) => {
    if (invoiceItems.length === 1) return;
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  const getSubtotal = () => invoiceItems.reduce((acc, item) => acc + (item.total || 0), 0);
  const getDiscountAmount = () => (discountPercent / 100) * getSubtotal();
  const getTaxAmount = () => (removeTax ? 0 : (taxPercent / 100) * (getSubtotal() - getDiscountAmount()));
  const getGrandTotal = () => getSubtotal() - getDiscountAmount() + (parseFloat(shipping) || 0) + getTaxAmount();

  const validateForm = () => {
    if (!invoiceNumber.trim() || !invoiceId.trim() || !invoiceDate || !dueDate) {
      alert("Please fill in Invoice Number, Quotation ID, Date, and Due Date.");
      return false;
    }
    for (const item of invoiceItems) {
      if (!item.product && !item.description.trim()) {
        alert("Each item must have a selected product or a custom description.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      customer,
      invoice_number: invoiceNumber.trim(),
      invoice_id: invoiceId.trim(),
      invoice_date: invoiceDate,
      due_date: dueDate,
      type: invoiceType,
      status,
      items: invoiceItems.map((item) => ({
        product: item.product,
        name: item.description?.trim() || "Unnamed item",
        description: item.description || "Unnamed item",
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.total),
      })),
      discount_percent: Number(discountPercent),
      shipping: Number(shipping),
      tax_percent: removeTax ? 0 : Number(taxPercent),
      subtotal: Number(getSubtotal()),
      total: Number(getGrandTotal()),
      name: invoiceItems.map((item) => item.description).join(", "),
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resText = await res.text();
      console.log("Response status:", res.status);
      console.log("Response body:", resText);

      if (res.ok) {
        alert("Quotation created successfully!");
        navigate("/invoices");
      } else {
        alert(`Failed to create quotation. Server says: ${resText}`);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("An error occurred while submitting.");
    }
  };

const PAGE_WIDTH = 210; // A4 width in mm
const LOGO_WIDTH = 150;
const LOGO_HEIGHT = 20;

// Currency formatter with ₹ symbol and Indian locale
const formatCurrency = (value) => {
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "Rs. 0.00";

  return `Rs. ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};


// Helper to clean numbers (remove commas, symbols)
const sanitizeNumber = (value) => {
  return parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
};

const generatePDF = () => {
  try {
    const doc = new jsPDF();

    // Centered Logo
    const logoX = (PAGE_WIDTH - LOGO_WIDTH) / 2;
    doc.addImage(logo, "PNG", logoX, 10, LOGO_WIDTH, LOGO_HEIGHT);

    // Header
    doc.setFontSize(12);
    doc.text("AUTO QUOTATION GENERATOR", 105, 42, { align: "center" });

    // Reference and Dates
    doc.setFontSize(11);
    doc.text(`REFERENCE: ${invoiceNumber || "-"}`, 14, 62);
    doc.text(`BILLING DATE: ${invoiceDate || "-"}`, 14, 68);
    doc.text(`DUE DATE: ${dueDate || "-"}`, 14, 74);

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
      body: invoiceItems?.map(item => [
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

    // Totals Table
    const endY = doc.lastAutoTable.finalY + 5;

    doc.autoTable({
      startY: endY,
      body: [
        ["Sub Total", formatCurrency(sanitizeNumber(getSubtotal()))],
        ["Discount(%)", `${discountPercent?.toFixed(2) || "0.00"}`],
        ["Shipping", formatCurrency(sanitizeNumber(shipping))],
        ["TAX/VAT(%)", removeTax ? "0.00" : (taxPercent?.toFixed(2) || "0.00")],
        ["Grand Total", formatCurrency(sanitizeNumber(getGrandTotal()))],
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
        if (data.row.index === 4) { // Grand Total row
          data.cell.styles.fillColor = [0, 0, 0];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    // Footer Payment Info
    const finalY = doc.lastAutoTable.finalY + 35; // shifted slightly lower

// Header: Payment Info Title
doc.setFontSize(12); // larger font size
doc.setFont(undefined, "bold"); // make it bold
doc.text("PAYMENT INFORMATION", 14, finalY);

// Reset font for the rest of the payment info
doc.setFontSize(10);
doc.setFont(undefined, "normal");

doc.text("Sridatta Infotech", 14, finalY + 6);
doc.text("BANK : THE AP MAHESH COOPERATIVE", 14, finalY + 12);
doc.text("BANK ACCOUNT NO: 018001200008056", 14, finalY + 18);
doc.text("IFSC CODE: APMC0000018", 14, finalY + 24);


    doc.save(`Quotation_${invoiceNumber || "quotation"}.pdf`);
    console.log("✅ PDF generated and saved");
  } catch (error) {
    console.error("❌ PDF generation failed:", error);
    alert("Error generating PDF. Check console for details.");
  }
};

  return (
    <div className="container mt-4">
      <h2>Create Quotation</h2>
      <Form onSubmit={handleSubmit}>
        {/* Invoice Metadata Section */}
        <Row className="mb-4">
          <Col md={3}>
            <FormGroup>
              <Label className="small">Quotation Number</Label>
              <Input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label className="small">Quotation ID</Label>
              <Input
                type="text"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label className="small">Quotation Date</Label>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label className="small">Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </FormGroup>
            <Row>
  <Col md={6}>
  <FormGroup>
    <Label className="small">Type</Label>
    <Input
      type="select"
      value={invoiceType}
      onChange={(e) => setInvoiceType(e.target.value)}
      style={{ width: '100%', maxWidth: '400px', height: '45px', fontSize: '16px', padding: '10px' }}
    >
      <option>Quotation</option>
      <option>Estimate</option>
    </Input>
  </FormGroup>
</Col>
<Col md={6}>
  <FormGroup>
    <Label className="small">Status</Label>
    <Input
      type="select"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      style={{ width: '100%', maxWidth: '400px', height: '45px', fontSize: '16px', padding: '8px' }}
    >
      <option>Open</option>
      <option>Paid</option>
      <option>Overdue</option>
    </Input>
  </FormGroup>
</Col>

</Row>

          </Col>
        </Row>

        {/* Customer & Shipping Info */}
        <Card className="mb-4">
          <CardBody>
            <Row>
              <Col md={6}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Customer Info</h5>
                  <Button color="primary" onClick={handleSelectExistingCustomer}>
                    Select Existing Customer
                  </Button>
                </div>
                {[
                  ["customer_name", "Full Name"],
                  ["customer_email", "Email"],
                  ["customer_phone", "Phone"],
                  ["customer_address_1", "Address Line 1"],
                  ["customer_address_2", "Address Line 2"],
                  ["customer_town", "City"],
                  ["customer_county", "State"],
                  ["customer_pincode", "Pincode"],
                ].map(([name, label]) => (
                  <FormGroup key={name}>
                    <Label>{label}</Label>
                    <Input
                      name={name}
                      value={customer[name] || ""}
                      onChange={handleInputChange}
                      required={["customer_name", "customer_email"].includes(name)}
                    />
                  </FormGroup>
                ))}
              </Col>
              <Col md={6}>
                <h5>Shipping Info</h5>
                {[
                  ["customer_name_ship", "Recipient Name"],
                  ["customer_address_1_ship", "Address Line 1"],
                  ["customer_address_2_ship", "Address Line 2"],
                  ["customer_town_ship", "City"],
                  ["customer_county_ship", "State"],
                  ["customer_pincode_ship", "Pincode"],
                ].map(([name, label]) => (
                  <FormGroup key={name}>
                    <Label>{label}</Label>
                    <Input
                      name={name}
                      value={customer[name] || ""}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                ))}
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Invoice Items */}
        <Card className="mb-4">
          <CardBody>
            <h5>Quotation Items</h5>
            {invoiceItems.map((item, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={3}>
                  <Label>Product</Label>
                  <Select
                    options={productOptions}
                    value={productOptions.find((opt) => opt.value === item.product) || null}
                    onChange={(selected) => handleProductChange(index, selected)}
                    isClearable
                  />
                </Col>
                <Col md={3}>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", parseFloat(e.target.value) || 0)
                    }
                  />
                </Col>
                <Col md={2}>
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", parseInt(e.target.value) || 1)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Label>Subtotal</Label>
                  <Input type="number" value={item.total.toFixed(2)} disabled />
                </Col>
                <Col md={1}>
                  <Button
                    color="danger"
                    onClick={() => removeProductRow(index)}
                    disabled={invoiceItems.length === 1}
                  >
                    ×
                  </Button>
                </Col>
              </Row>
            ))}
            <Button color="success" onClick={addProductRow}>
              + Add Product
            </Button>
          </CardBody>
        </Card>

        {/* Summary */}
        <div className="d-flex justify-content-end">
          <RBCard style={{ width: "300px" }} className="shadow-sm">
            <RBCard.Body>
              <h6 className="border-bottom pb-2 mb-3">Quotation Summary</h6>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 align-items-center">
                <span>Discount (%):</span>
                <RBForm.Control
                  type="number"
                  min={0}
                  max={100}
                  className="form-control-sm text-end"
                  style={{ width: "100px" }}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="d-flex justify-content-between mb-2 align-items-center">
                <span>Shipping:</span>
                <RBForm.Control
                  type="number"
                  min={0}
                  className="form-control-sm text-end"
                  style={{ width: "100px" }}
                  value={shipping}
                  onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="d-flex justify-content-between mb-2 align-items-center">
                <span>Tax (%):</span>
                <RBForm.Control
                  type="number"
                  min={0}
                  max={100}
                  className="form-control-sm text-end"
                  style={{ width: "100px" }}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  disabled={removeTax}
                />
              </div>

              <RBForm.Check
                type="checkbox"
                label="Remove Tax"
                checked={removeTax}
                onChange={(e) => setRemoveTax(e.target.checked)}
              />

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span>₹{getGrandTotal().toFixed(2)}</span>
              </div>
            </RBCard.Body>
          </RBCard>
        </div>

        <div className="mt-4 d-flex justify-content-end gap-2">
  <Button color="secondary" onClick={() => navigate("/invoices")}>
    Cancel
  </Button>
  <Button color="primary" onClick={generatePDF}>Generate PDF</Button>

  <Button color="primary" type="submit">
    Create Quotation
  </Button>
</div>

      </Form>
    </div>
  );
};

export default InvoiceCreate;