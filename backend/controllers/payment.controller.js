const Payment = require("../models/payment.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = {
  createPayment: async (req, res) => {
    try {
      const { amount, paymentDate, dueDate, paymentMethod, description } =
        req.body;

      // Generate reference number
      const referenceNumber = `PAY-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      // Create payment
      const payment = await Payment.create({
        vendorId: req.user._id,
        amount,
        paymentDate,
        dueDate,
        paymentMethod,
        description,
        referenceNumber,
        invoiceNumber,
      });

      // Generate invoice PDF
      const invoicePath = await generateInvoice(payment);
      payment.invoiceUrl = `/uploads/invoices/${payment.invoiceNumber}.pdf`;
      await payment.save();

      res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating payment",
        error: error.message,
      });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.find().populate(
        "vendorId",
        "name email businessName"
      );

      res.json({
        success: true,
        data: payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching payments",
        error: error.message,
      });
    }
  },

  getVendorPayments: async (req, res) => {
    try {
      const payments = await Payment.find({ vendorId: req.user._id }).populate(
        "vendorId",
        "name email businessName"
      );

      res.json({
        success: true,
        data: payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching vendor payments",
        error: error.message,
      });
    }
  },

  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const payment = await Payment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate("vendorId", "name email businessName");

      res.json({
        success: true,
        message: "Payment status updated successfully",
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating payment status",
        error: error.message,
      });
    }
  },
};

// Helper function to generate invoice PDF
async function generateInvoice(payment) {
  const doc = new PDFDocument();
  const invoicePath = path.join(
    __dirname,
    `../uploads/invoices/${payment.invoiceNumber}.pdf`
  );

  // Ensure directory exists
  if (!fs.existsSync(path.join(__dirname, "../uploads/invoices"))) {
    fs.mkdirSync(path.join(__dirname, "../uploads/invoices"), {
      recursive: true,
    });
  }

  // Pipe PDF to file
  doc.pipe(fs.createWriteStream(invoicePath));

  // Add content to PDF
  doc.fontSize(25).text("Invoice", { align: "center" }).moveDown().fontSize(12);

  doc
    .text(`Invoice Number: ${payment.invoiceNumber}`)
    .text(`Reference Number: ${payment.referenceNumber}`)
    .text(`Payment Date: ${payment.paymentDate.toLocaleDateString()}`)
    .text(`Due Date: ${payment.dueDate.toLocaleDateString()}`)
    .text(`Amount: $${payment.amount.toFixed(2)}`)
    .text(`Payment Method: ${payment.paymentMethod}`)
    .text(`Description: ${payment.description || "N/A"}`);

  doc.end();
  return invoicePath;
}
