// invoiceTemplate.js
const InvoiceTemplate = ({
    department,
    invoiceNumber,
    invoiceDate,
    paymentDate,
    dueDate,
    vendorDetails,
    paymentCondition,
    partialRatio1,
    partialRatio2,
    invoiceAmount,
    savedEntry,
}) => {
    let mailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; padding: 20px;">
            <tr>
              <td align="center">
                <h1 style="color: #333;">Invoice Details</h1>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px;">
                <p style="font-size: 18px; color: #555;">Hello ${vendorDetails?.name},</p>
                <p style="font-size: 16px; color: #555;">Below are the details of your invoice.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <table align="center" cellpadding="10" style="border-collapse: collapse; width: 100%; max-width: 600px;">
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Applicant Name</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${vendorDetails?.name}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Department:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${department}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Invoice Number:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Invoice Date:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(invoiceDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Payment Date:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(paymentDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Due Date:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(dueDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Invoice Amount:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${invoiceAmount}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Payment Condition:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${paymentCondition}</td>
                  </tr>`;

    if (paymentCondition === "Partial Payment" && partialRatio1 != null && partialRatio2 != null) {
        mailContent += `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Amount to Pay Now (%):</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${partialRatio1}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Amount Due Later (%):</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${partialRatio2}</td>
                  </tr>`;
    }

    mailContent += `
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px;">
                <a href="http://localhost:3000/approve?id=${savedEntry._id}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                  Approve
                </a>
                <a href="http://localhost:3000/reject?id=${savedEntry._id}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                  Reject
                </a>
                <a href="http://localhost:3000/edit?id=${savedEntry._id}&date=${encodeURIComponent(invoiceDate)}&department=${encodeURIComponent(
        department
    )}&dueDate=${encodeURIComponent(dueDate)}&invoiceAmount=${encodeURIComponent(
        invoiceAmount
    )}&invoiceNumber=${encodeURIComponent(invoiceNumber)}&paymentCondition=${encodeURIComponent(
        paymentCondition
    )}&vendorName=${encodeURIComponent(vendorDetails?.name)}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">
                  Edit
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px; color: #888;">
                <p>Thank you for choosing our service!</p>
                <p style="font-size: 14px;">Best Regards,<br>The Finance Team</p>
              </td>
            </tr>
          </table>
        </body>
      </html>`;

    return mailContent;
};

module.exports = InvoiceTemplate;