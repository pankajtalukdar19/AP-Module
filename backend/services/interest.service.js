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
      this.calculateDailyInterest();
    });

    // Monthly principal update on last day of month at 23:59
    CronJob.scheduleJob("59 23 L * *", () => {
      this.updateMonthlyPrincipal();
    });
  }

  // Calculate daily interest for all vendors
  static async calculateDailyInterest() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const settings = await Settings.findOne();
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Get all approved applications for the current date
      const todaysApplications = await Application.find({
        status: "approved",
        createdAt: {
          $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
          $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
        },
      });

      // Group applications by vendor
      const vendorApplications = {};
      todaysApplications.forEach((app) => {
        if (!vendorApplications[app.vendorId]) {
          vendorApplications[app.vendorId] = [];
        }
        vendorApplications[app.vendorId].push({
          applicationId: app._id,
          amount: app.invoiceAmount,
          date: app.createdAt,
        });
      });

      // Process each vendor's interest
      for (const [vendorId, applications] of Object.entries(
        vendorApplications
      )) {
        let interest = await Interest.findOne({
          vendorId,
          month,
          year,
        });

        if (!interest) {
          interest = new Interest({
            vendorId,
            month,
            year,
            interestRate: settings.intrestRate,
            lastCalculatedDate: currentDate,
            applications: [],
          });
        }

        // Add new applications
        interest.applications.push(...applications);

        // Calculate total principal (including today's applications)
        const totalPrincipal =
          interest.principalAmount +
          applications.reduce((sum, app) => sum + app.amount, 0);

        // Calculate daily interest
        const dailyInterest = (totalPrincipal * settings.intrestRate) / 365;
        interest.dailyInterest = dailyInterest;
        interest.totalInterest += dailyInterest;
        interest.principalAmount = totalPrincipal;
        interest.lastCalculatedDate = currentDate;

        await interest.save({ session });
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
              vendorId: interest.vendorId,
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
