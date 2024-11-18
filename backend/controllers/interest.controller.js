const interest = require('../models/interest_schema');
const application = require('../models/application_schema');

const interestRate = 15
const perdayInterestRate = (interestRate / 365).toFixed(8);
console.log('perdayInterestRate', perdayInterestRate);

module.exports = {
    interest: async () => {
        try {


            const applicationData = await application.find({
                status: 'approved'
            })

            if (applicationData.length > 0) {

                await Promise.all(
                    applicationData.map(async (data) => {
                        if (data) {
                            const saveData = {
                                vendorId: data.vendorName,
                                invoiceAmount: data.calculatedInvoiceAmount ? data.calculatedInvoiceAmount : '0.00',
                                interestRate: interestRate,
                                perdayInterestRate: perdayInterestRate,
                                interestAmount: (Number(data.calculatedInvoiceAmount) * perdayInterestRate).toFixed(2),
                            };
                            try {
                                const interestData = new interest(saveData);
                                await interestData.save();
                            } catch (err) {
                                console.error("Error saving data for application ID:", data._id, err.message);
                            }
                        }
                    })
                );

            }

            return


        } catch (err) {
            return err
        }
    },
    getDataByDate: async (req, res) => {
        try {
            const { startDate, endDate, vendorId } = req.query;
            const filter = {};


            if (startDate && endDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0);

                const end = new Date(endDate);
                end.setHours(23, 59, 59);

                filter.createdAt = { $gte: start, $lte: end };
            }
            if (vendorId) {
                filter.vendorId = vendorId;
            }

            const interestData = await interest.find(filter ? filter : "").populate('vendorId');

            return res.status(200).json({ success: true, msg: "Applications retrieved successfully", interestData });
        } catch (err) {
            console.error('Error occurred:', err);
            return res.status(500).json({ success: false, msg: "There was an error", error: err.message });
        }
    }
}