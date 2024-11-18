const vendor = require('../models/vendor_schema');
const interest = require('../models/interest_schema');
const application = require('../models/application_schema');
const payment = require('../models/payment_schema');

module.exports = {
    create: async (req, res) => {
        try {
            const new_vendor = new vendor(req.body);
            const data = await new_vendor.save();
            res.json({ success: true, msg: "vendor Added successfully", data })
        } catch (err) {
            return res.status(500).json({ success: false, msg: "there is some error", error: err.message })
        }
    },
    get: async (req, res) => {
        try {
            const data = await vendor.find();
            if (!data) {
                return res.json({ success: false, msg: "not found" });
            }



            let totalData = [];

            if (data.length > 0) {
                // Use Promise.all to handle the array of promises correctly
                totalData = await Promise.all(
                    data.map(async (dd) => {
                        if (dd) {
                            try {
                                // Fetch interest data using the vendor's _id
                                const interestData = await interest.find({ vendorId: dd?._id });
                                const applicationData = await application.find({ vendorName: dd?._id });
                                const paymentData = await payment.find({ vendorId: dd?._id });
            
                                // Calculate total interest amount
                                const total = interestData.reduce((sum, item) => {
                                    return sum + (item.interestAmount || 0);
                                }, 0);

                                const appl = applicationData.reduce((sum, item) => {
                                    return sum + (item.calculatedInvoiceAmount || 0);
                                }, 0);

                                const payl = paymentData.reduce((sum, item) => {
                                    return sum + (item.paidAmount || 0);
                                }, 0);
            
                                // Return the object containing interest data, total, and the current data entry
                                return {
                                    interestData,
                                    totalinterest:total,
                                    totalLoan:appl,
                                    totalPayment:payl,
                                    ...dd?._doc
                                };
                            } catch (err) {
                                // Return the vendor data even if there's an error fetching interest data
                                console.error(err);  // Log the error for debugging purposes
                                return {
                                    dd,
                                    error: err.message || 'Error fetching interest data'
                                };
                            }
                        } else {
                            // Return an empty object if dd is falsy
                            return {};
                        }
                    })
                );
            }
            
            // Return the response with the gathered data
            return res.json({ success: true, msg: "Vendor fetched successfully", data: totalData });
        } catch (err) {
            return res.status(500).json({ success: false, msg: "resMessage[defaultLang].Something_Went_Wrong", error: err.message })
        }
    },
}