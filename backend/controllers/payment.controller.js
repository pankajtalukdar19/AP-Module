const payment = require('../models/payment_schema');

module.exports = {
    payment: async (req, res) => {
        try {
            const new_payment = new payment(req.body);
            const data = await new_payment.save();
            res.json({ success: true, msg: "amount paid successfully", data })
        } catch (err) {
            return res.status(500).json({ success: false, msg: "there is some error", error: err.message})
        }
    },
    getPaymentDataByVendorId: async (req, res) => {
        try {
            const vendorId = req.params.id;
    
            const data = await payment.find({ vendorId }).populate('vendorId');
    
            if (!data || data.length === 0) {
                return res.json({ success: false, msg: "No transactions available for this vendor" });
            }
    
            return res.json({ success: true, msg: "Transactions fetched successfully", data });
        } catch (err) {
            console.error('Error fetching transactions:', err);
    
            return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message });
        }
    },
}