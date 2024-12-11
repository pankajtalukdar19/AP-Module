const CronJob = require("node-schedule");
const Interest = require("../models/interest.model");
const Application = require("../models/applications.model");
const mongoose = require("mongoose");

class InterestService {
  static initCronJobs() {
    CronJob.scheduleJob("0 0 * * *", this.calculateDailyInterest.bind(this));
    CronJob.scheduleJob("59 23 L * *", this.updateMonthlyPrincipal.bind(this));
  }

  static async calculateDailyInterest() {
    console.log("calculateDailyInterest function started");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const currentDate = new Date();
      

      const applications = await Application.find({ status: "approved" });
      const interestsArray = applications.map((app) => ({
        userID: app.userID,
        principalAmount: app.calculatedInvoiceAmount,
        interestRate: app.interestRate,
        dailyInterest: app.calculatedInvoiceAmount * app.interestRate,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        lastCalculatedDate: currentDate,
        applicationId: app._id,
      }));

      await Interest.insertMany(interestsArray, { session });
      await session.commitTransaction();
    } catch (error) {
      console.error("Error in daily interest calculation:", error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  static async updateMonthlyPrincipal() {
    console.log("updateMonthlyPrincipal function started");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const applications = await Application.find({ status: "approved" });

      for (const app of applications) {
        const interests = await Interest.find({
          userID: app.userID,
          accumulatedInterest: false,
        });

        const totalInterest = interests.reduce(
          (sum, interest) => sum + interest.totalInterest,
          0
        );

        await Promise.all([
          Interest.updateMany(
            { userID: app.userID, accumulatedInterest: false },
            { $set: { accumulatedInterest: true } },
            { session }
          ),
          Application.findByIdAndUpdate(
            app._id,
            { $inc: { calculatedInvoiceAmount: totalInterest } },
            { session }
          ),
        ]);
      }

      await session.commitTransaction();
    } catch (error) {
      console.error("Error in monthly principal update:", error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}

module.exports = InterestService;
