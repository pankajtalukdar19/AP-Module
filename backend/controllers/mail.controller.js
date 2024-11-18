const nodemailer = require('nodemailer');
const application = require('../models/application_schema');
const interest = require('../models/interest_schema');
const vendor = require('../models/vendor_schema')
const key = require('../models/keys_scema')
const moment = require('moment');
const mongoose = require('mongoose');

const sendToD2RHMG = async (data) => {
  const keys = await key.find()

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys[0]?.username,
      pass: keys[0]?.key,
    }
  });

  let mailOptions = {
    from: keys[0]?.username,
    to: data.department === 'HMG' ? 'pankajtalukdar08@gmail.com' : 'pankajtalukdar08@gmail.com',
    subject: 'Invoice Details',
    html: `
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
            <p style="font-size: 18px; color: #555;"> Hello ${data.vendorName}, </p>
            <p style="font-size: 16px; color: #555;"> Below are the details of your invoice. </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <table align="center" cellpadding="10" style="border-collapse: collapse; width: 100%; max-width: 600px;">
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Applicant Name</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${data.vendorName}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Department:</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${data.department}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Invoice Date:</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(data.invoiceDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Payment Date:</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(data.paymentDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Due Date:</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(data.dueDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Invoice Amount:</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${data.invoiceAmount}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Invoice Number:</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${data.invoiceNumber}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Payment Condition:</strong>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${data.paymentCondition}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px;">
            <a href="http://15.207.107.98:3000/approve?id=${data.savedEntryId._id}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;"> Approve </a>
            <a href="http://15.207.107.98:3000/reject?id=${data.savedEntryId._id}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;"> Reject </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px; color: #888;">
            <p>Thank you for choosing our service!</p>
            <p style="font-size: 14px;">Best Regards, <br>The Finance Team </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
        `,
  };

  return transporter.sendMail(mailOptions);
};



module.exports = {
  send: async (req, res) => {
    try {
      const {
        date,
        invoiceDate,
        paymentDate,
        department,
        dueDate,
        invoiceAmount,
        invoiceNumber,
        paymentCondition,
        partialRatio1,
        partialRatio2,
        userEmail,
        vendorName,
      } = req.body;

      const keys = await key.find()

      const vendorDetails = await vendor.findOne({ _id: vendorName });

      const newMailerEntry = new application({ ...req.body, calculatedInvoiceAmount: invoiceAmount });
      const savedEntry = await newMailerEntry.save();

      if (savedEntry) {
        res.status(200).json({ success: true, msg: "Application saved", savedEntry });

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: keys[0]?.username,
            pass: keys[0]?.key,
          }
        });

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

        if (paymentCondition === 'Partial Payment' && partialRatio1 != null && partialRatio2 != null) {
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

        mailContent += `</table></td></tr>
                                                        <tr>
                                                            <td align="center" style="padding: 20px;">
                                                                <a href="http://15.207.107.98:3000/approve?id=${savedEntry._id}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                                                                    Approve
                                                                </a>
                                                                <a href="http://15.207.107.98:3000/reject?id=${savedEntry._id}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #fff; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                                                                    Reject
                                                                </a>
                                                                <a href="http://15.207.107.98:3000/edit?id=${savedEntry._id}&date=${encodeURIComponent(date)}&department=${encodeURIComponent(department)}&dueDate=${encodeURIComponent(dueDate)}&invoiceAmount=${encodeURIComponent(invoiceAmount)}&invoiceNumber=${encodeURIComponent(invoiceNumber)}&paymentCondition=${encodeURIComponent(paymentCondition)}&vendorName=${encodeURIComponent(vendorName)}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">
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

        const mailOptions = {
          from: keys[0]?.username,
          to: userEmail,
          subject: 'Invoice Details',
          html: mailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, msg: "Error sending email", error: error.message });
          } else {
            console.log('Message sent: %s', info.messageId);
            return res.status(200).json({ success: true, msg: "Email sent", info: info });
          }
        });
      }
    } catch (err) {
      console.error('Error occurred:', err);
      return res.status(500).json({ success: false, msg: "There was an error", error: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const data = await application.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
      await sendToD2RHMG(data);

      res.json({ success: true, msg: "Application is approved", data });
    } catch (err) {
      return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message });
    }
  },
  getDataById: async (req, res) => {
    try {
      const data = await application.findOne({ _id: req.params.id });
      return res.json({ success: true, msg: "get success", data });
    } catch (err) {
      return res.status(500).json({ success: false, msg: "Something_Went_Wrong", error: err.message });
    }
  },
  reject: async (req, res) => {
    try {

      const {
        invoiceDate,
        paymentDate,
        department,
        dueDate,
        invoiceAmount,
        invoiceNumber,
        paymentCondition,
        vendorName,
        userEmail
      } = req.body;

      const keys = await key.find()


      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: keys[0]?.username,
          pass: keys[0]?.key,
        }
      });

      let mailOptions = {
        from: keys[0]?.username,
        to: userEmail,
        subject: 'Your Invoice is rejected',
        html: `
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
                <p style="font-size: 18px; color: #555;"> Hello ${vendorName}, </p>
                <p style="font-size: 16px; color: #555;"> Below are the details of your invoice. </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <table align="center" cellpadding="10" style="border-collapse: collapse; width: 100%; max-width: 600px;">
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Applicant Name</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${vendorName}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Department:</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${department}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Invoice Date:</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(invoiceDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Payment Date:</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(paymentDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Due Date:</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(dueDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Invoice Amount:</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${invoiceAmount}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Invoice Number:</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                      <strong>Payment Condition:</strong>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${paymentCondition}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px; color: #888;">
                <p>Thank you for choosing our service!</p>
                <p style="font-size: 14px;">Best Regards, <br>The Finance Team </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
            `,
      };

      transporter.sendMail(mailOptions);
      return await application.findOneAndUpdate({ _id: req.params.id }, { status: 'pending' }, { new: true });

    } catch (err) {
      return res.status(500).json({ success: false, msg: "There was an error", error: err.message });
    }
  },
  getApplication: async (req, res) => {
    try {
      const data = await application.find().populate('vendorName');

      if (data.length === 0) {
        return res.status(404).json({ success: false, msg: "No applications found" });
      }

      return res.status(200).json({ success: true, msg: "Applications fetched successfully", data });
    } catch (err) {
      return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message });
    }
  },

  updateCalculatedAmount: async () => {
    try {
      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');



      const applicationData = await application.find({ status: 'approved' });

      if (applicationData.length > 0) {
        await Promise.all(
          applicationData.map(async (data) => {
            if (data) {
              let newAmount = data?.calculatedInvoiceAmount || 0;

              try {
                const interestData = await interest.find({
                  vendorId: data?.vendorName,
                  createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                });

                const total = interestData.reduce((sum, item) => {
                  return sum + (item.interestAmount || 0);
                }, 0);

                await application.findOneAndUpdate(
                  { _id: data._id },
                  {
                    calculatedInvoiceAmount: Number(newAmount) + Number(total.toFixed(2))
                  },
                  { new: true }
                );
              } catch (err) {
                console.error("Error saving data for application ID:", data._id, err.message);
              }
            }
          })
        );
      }
    } catch (err) {
      console.error("Error updating calculated amounts:", err.message);
      return err;
    }
  },
  getAllByVendorId: async (req, res) => {
    try {
      const { vendorId } = req.params;

      const data = await application.find({ 'vendorName': vendorId }).populate('vendorName');

      if (data.length === 0) {
        console.log("No data found", vendorId);
        return res.status(500).json({ success: false, msg: "No data found for the given Vendor ID." + vendorId });
      }

      return res.status(200).json({ success: true, msg: "Data retrieved successfully", data });
    } catch (err) {
      console.error("Error fetching data by Vendor ID:", err.message);
      return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message });
    }
  },
  getOnlyVendorName: async (req, res) => {
    try {
      const data = await application.find().populate('vendorName');

      if (data.length === 0) {
        return res.status(500).json({ success: false, msg: "No applications found" });
      }

      return res.status(200).json({ success: true, msg: "Applications fetched successfully", data });
    } catch (err) {
      return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message });
    }
  }
}