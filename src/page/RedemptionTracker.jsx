import React, { useState, useEffect } from 'react';
import './RedemptionTracker.css';

const RedemptionTracker = () => {
    const limit = 100000; // Redemption limit
    const interestRate = 0.04109589; // Daily interest rate

    const [redeemedAmount, setRedeemedAmount] = useState(0);
    const [dailyInterests, setDailyInterests] = useState([]); // Store daily interest in an array
    const [month, setMonth] = useState(new Date().getMonth()); // Current month
    const [totalMonthlyInterest, setTotalMonthlyInterest] = useState(0); // Total interest for the month
    const [dates, setDates] = useState([new Date().toLocaleDateString()]); // Start with today's date

    const [redeemAmountInput, setRedeemAmountInput] = useState(''); // Input for redeem amount
    const [repayAmountInput, setRepayAmountInput] = useState(''); // Input for repayment amount

    const [redeemedTransactions, setRedeemedTransactions] = useState([]); // Store redeemed transactions
    const [repaymentTransactions, setRepaymentTransactions] = useState([]); // Store repayment transactions

    const redeem = () => {
        const amount = parseFloat(redeemAmountInput);

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid redemption amount.');
            return;
        }

        if (redeemedAmount + amount > limit) {
            alert('Error: Redemption exceeds the limit.');
            return;
        }

        setRedeemedAmount((prev) => prev + amount);
        setRedeemedTransactions((prev) => [
            ...prev,
            { amount, time: new Date().toLocaleString() },
        ]);
        setRedeemAmountInput(''); 
    };

    const applyDailyInterest = () => {
        const dailyInterest = redeemedAmount * interestRate;
        setDailyInterests((prev) => [...prev, dailyInterest]); // Add daily interest to the array
    };

    const repay = () => {
        const amount = parseFloat(repayAmountInput);

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid repayment amount.');
            return;
        }

        if (amount > redeemedAmount) {
            alert('Error: Repayment amount exceeds the total redeemed amount.');
            return;
        }

        setRedeemedAmount((prev) => prev - amount);
        setRepaymentTransactions((prev) => [
            ...prev,
            { amount, time: new Date().toLocaleString() }, // Store amount and timestamp
        ]);
        setRepayAmountInput(''); // Clear input after repayment
    };

    // Calculate total monthly interest in real-time whenever daily interests change
    useEffect(() => {
        const totalInterest = dailyInterests.reduce((acc, curr) => acc + curr, 0);
        setTotalMonthlyInterest(totalInterest);
    }, [dailyInterests]);

    // Add monthly interest to redeemed amount at the start of a new month
    useEffect(() => {
        const currentMonth = new Date().getMonth();
        if (currentMonth !== month) {
            // Add total interest to redeemed amount and reset daily interests
            setRedeemedAmount((prev) => prev + totalMonthlyInterest);
            setDailyInterests([]);
            setTotalMonthlyInterest(0);
            setMonth(currentMonth); // Update the current month
            setDates([new Date().toLocaleDateString()]); // Reset the date tracking for the new month
        }
    }, [month, totalMonthlyInterest]);

    // Calculate remaining unredeemed amount
    const remainingUnredeemed = limit - redeemedAmount;

    return (
        <div className="redemption-tracker">
            <h1>Redemption Tracker</h1>
            <div className="summary">
                <h2>Total Limit: {limit.toFixed(2)}</h2>
                <h2>Total Redeemed Amount: {redeemedAmount.toFixed(2)}</h2>
                <h2>Remaining Unredeemed Amount: {remainingUnredeemed.toFixed(2)}</h2>
                <h3>Daily Interest Accrued:</h3>
                <ul>
                    {dailyInterests.map((interest, index) => (
                        <li key={index}>
                            {dates[index]} {interest.toFixed(2)} 
                        </li>
                    ))}
                </ul>
                <h3>Total Monthly Interest : {totalMonthlyInterest.toFixed(2)}</h3>
            </div>
            <div className="controls">
                <input
                    type="number"
                    value={redeemAmountInput}
                    onChange={(e) => setRedeemAmountInput(e.target.value)}
                    placeholder="Enter amount to redeem"
                    className="input-field"
                />
                <button onClick={redeem} className="button">Redeem Amount</button>
            </div>
            <div className="controls">
                <input
                    type="number"
                    value={repayAmountInput}
                    onChange={(e) => setRepayAmountInput(e.target.value)}
                    placeholder="Enter amount to repay"
                    className="input-field"
                />
                <button onClick={repay} className="button">Repay Amount</button>
            </div>
            <div className="controls">
                <button onClick={applyDailyInterest} className="button">Apply Daily Interest</button>
            </div>
            <div className="transaction-lists">
                <h3>Redeemed Transactions:</h3>
                <ul>
                    {redeemedTransactions.map((transaction, index) => (
                        <li key={index}>
                            {transaction.amount.toFixed(2)} - {transaction.time}
                        </li>
                    ))}
                </ul>
                <h3>Repayment Transactions:</h3>
                <ul>
                    {repaymentTransactions.map((transaction, index) => (
                        <li key={index}>
                            {transaction.amount.toFixed(2)} - {transaction.time}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RedemptionTracker;