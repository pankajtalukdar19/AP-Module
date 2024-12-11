const CronJob = require("node-schedule");
const Interest = require("../models/interest.model");
const Application = require("../models/applications.model");
const Settings = require("../models/settings.model");
const mongoose = require("mongoose");
const cronParser = require("cron-parser");

class InterestService {
  // Initialize cron jobs
  static initCronJobs() {
    // Daily interest calculation at midnight
    CronJob.scheduleJob("0 0 * * *", () => {
      console.log("Daily interest calculation started");
      this.calculateDailyInterest();
    });

    // Monthly principal update on last day of month at 23:59
    CronJob.scheduleJob("59 23 L * *", () => {
      console.log("Monthly principal update started");
      this.updateMonthlyPrincipal();
    });
  }

  // Calculate daily interest for all vendors
  static async calculateDailyInterest() {
    console.log("calculateDailyInterest function started");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const settings = await Settings.findOne();
      const currentDate = new Date();
      

      // Get all approved applications  
      const todaysApplications = await Application.find({
        status: "approved",
      });


      // Process each vendor's interest
      for (const application of todaysApplications) {

        console.log('application', application);
        
        const userID = application.userID; 

        const dailyInterest = ((application.calculatedInvoiceAmount || 0) * (settings.intrestRate || 0)) / 365;
        const UpdateData = {
          userID,
          principalAmount: application.calculatedInvoiceAmount,
          interestRate: settings.intrestRate,
          dailyInterest: dailyInterest,
          totalInterestAmount: 0,
          lastCalculatedDate: currentDate,
          applicationId: application._id,
        }; 
        
        await Interest.create([UpdateData],{ session });
      } 

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("Error calculating daily interest:", error);
    } finally {
      session.endSession();
    }
  }

  // Update monthly principal by adding accumulated interest
  static async updateMonthlyPrincipal() {
    console.log("updateMonthlyPrincipal function started");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Get all interest records for current month
      const interests = await Interest.find({ month, year });

      // Create next month's records with updated principal
      for (const interest of interests) {
        const newPrincipal = interest.principalAmount + interest.totalInterest;

        await Interest.create(
          [
            {
              userId: interest.userId,
              principalAmount: newPrincipal,
              interestRate: interest.interestRate,
              month: month === 12 ? 1 : month + 1,
              year: month === 12 ? year + 1 : year,
              lastCalculatedDate: currentDate,
              applications: [],
            },
          ],
          { session }
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("Error updating monthly principal:", error);
    } finally {
      session.endSession();
    }
  }
}

module.exports = InterestService;
