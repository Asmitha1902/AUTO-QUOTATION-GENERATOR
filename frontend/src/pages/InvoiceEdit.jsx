import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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

const InvoiceEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Invoice ID from URL param

  const [products, setProducts] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
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

  // Fetch products for selection
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

  // Fetch invoice data by ID for editing
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoices/${id}`);
        if (!res.ok) throw new Error("Quotation not found");
        const data = await res.json();

        setCustomer(data.customer || {});
        setInvoiceNumber(data.invoice_number || "");
        setInvoiceId(data.invoice_id || "");
        setInvoiceDate(data.invoice_date ? data.invoice_date.slice(0, 10) : "");
        setDueDate(data.due_date ? data.due_date.slice(0, 10) : "");
        setInvoiceType(data.type || "Quotation");
        setStatus(data.status || "Open");
        setDiscountPercent(data.discount_percent || 0);
        setShipping(data.shipping || 0);
        setTaxPercent(data.tax_percent || 0);
        setRemoveTax(data.tax_percent === 0);

        // Map items to invoiceItems format
        setInvoiceItems(
          (data.items || []).map((item) => ({
            product: item.product || null,
            description: item.description || "",
            quantity: item.quantity || 1,
            price: item.price || 0,
            total: item.total || 0,
          }))
        );
      } catch (err) {
        console.error("Error fetching quotation:", err);
        alert("Failed to load quotation data.");
        navigate("/invoices");
      }
    };
    if (id) fetchInvoice();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectExistingCustomer = () => {
    navigate("/customers", { state: { fromInvoiceEdit: true } });
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

  const getSubtotal = () =>
    invoiceItems.reduce((acc, item) => acc + (item.total || 0), 0);
  const getDiscountAmount = () => (discountPercent / 100) * getSubtotal();
  const getTaxAmount = () =>
    removeTax ? 0 : (taxPercent / 100) * (getSubtotal() - getDiscountAmount());
  const getGrandTotal = () =>
    getSubtotal() - getDiscountAmount() + (parseFloat(shipping) || 0) + getTaxAmount();

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
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resText = await res.text();
      if (res.ok) {
        alert("Quotation updated successfully!");
        navigate("/invoices");
      } else {
        alert(`Failed to update quotation. Server says: ${resText}`);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("An error occurred while submitting.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Quotation</h2>
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
            <FormGroup>
              <Label className="small">Type</Label>
              <Input
                type="select"
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
              >
                <option>Quotation</option>
                <option>Estimate</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label className="small">Status</Label>
              <Input
                type="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Open</option>
                <option>Paid</option>
                <option>Overdue</option>
              </Input>
            </FormGroup>
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

              <RBButton
                type="submit"
                variant="primary"
                className="w-100 mt-3"
              >
                Update Quotation
              </RBButton>
            </RBCard.Body>
          </RBCard>
        </div>
      </Form>
    </div>
  );
};

export default InvoiceEdit;
