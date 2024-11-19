import React, { useEffect, useState } from 'react';
import interestService from 'service/interestService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import vendorService from 'service/vendorService';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import 'primeflex/primeflex.css';
import paymentService from 'service/paymentService';
import { TabView, TabPanel } from 'primereact/tabview';
import * as moment from 'moment'
import { useParams } from 'react-router-dom';


const ApplicationsDetails = () => {
    const [interestData, setInterestData] = useState([]);
    const { id } = useParams();

    const [isModalVisible, setModalVisible] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentTransactions, setPaymentTransactions] = useState([]);
    const [limit, setLimit] = useState(1000000)

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY hh:mm A')
    }

    const getPaymentData = async () => {
        try {
            const response = await paymentService.paymentDataById(id)
            setPaymentTransactions(response?.data.data?.map((i) => ({
                ...i,
                createdAt: formatDate(i.createdAt)
            })) || []);
        } catch (error) {
            console.log('payment error');

        }
    };

    const getData = async () => { 
        try {
            const response = await interestService.getDataByDate({application:id});
            setInterestData(
                response?.data?.interestData.map((i) => ({
                    ...i,
                    createdAt: formatDate(i.createdAt)
                })) || []
            );

        } catch (error) {
            console.error('Error fetching application data:', error);
        }
    };

    useEffect(() => {
        getPaymentData();
        getData()
    }, []);

    const totalInterestAmount = parseFloat(
        interestData.reduce((total, item) => {
            return total + (item.interestAmount || 0);
        }, 0).toFixed(2)
    );

    const totalInvoiceAmount = interestData.reduce((total, item) => {
        return total + (item.invoiceAmount || 0);
    }, 0).toFixed(2);

    const totalPaymentAmount = paymentTransactions.reduce((total, item) => {
        return total + (item.paidAmount || 0);
    }, 0).toFixed(2);


    const handlePaymentClick = () => {
        setModalVisible(true);
    };

    const handlePaymentSubmit = async () => {
        const data = {
            vendorId: id,
            paidAmount: paymentAmount
        }

        await paymentService.payment(data)
        const total = Number(limit) + Number(paymentAmount);
        const formattedTotal = parseFloat(total.toFixed(2));
        setLimit(formattedTotal);
        setModalVisible(false);
        setPaymentAmount('');
        getPaymentData()
        
    };
    const totalLimit =()=>{
        console.log(paymentAmount);
        
        const allAmount = limit - Number(totalInvoiceAmount) + Number(paymentAmount)
        return setLimit(allAmount)
    }

    const handleNewMonth =()=>{
        console.log(paymentAmount);
        
        const allAmount = limit - Number(totalInterestAmount)
        return setLimit(allAmount)
    }

    useEffect(()=>{
    
        totalLimit()
    },[totalInvoiceAmount])


    return (
        <div className="p-grid p-justify-center p-mt-4">


            {interestData.length > 0 ? (
                <>
                    <div className="result">
                        {/* <Card title="Vendor Name" className="mr-2 p-shadow-3" style={{ padding: '1rem' }}>
                            <p className="m-0">{ }</p>
                        </Card> */}
                        <Card title="Limit Left" className="mr-2 p-shadow-3" style={{ padding: '1rem' }}>
                            <p className="m-0">{limit}</p>
                        </Card>
                        <Card title="Total Interest" className="mr-2 p-shadow-3" style={{ padding: '1rem' }}>
                            <p className="m-0">{totalInterestAmount}</p>
                        </Card>
                        <Card title="Loan Amount" className="mr-2 p-shadow-3" style={{ padding: '1rem' }}>
                            <p className="m-0">{totalInvoiceAmount}</p>
                        </Card>
                        <Card title="Info" className="mr-2 p-shadow-3" style={{ padding: '1rem' }}>
                            <p className="m-0">Loan Amount : {totalInvoiceAmount}</p>

                            <p className="m-0">Intrest Amount : {totalInterestAmount}</p>
                            <hr />
                            <p className="m-0">Amount Paid : {totalPaymentAmount}</p>
                            <hr />
                            <p className="m-0"> Total Overdue: {((Number(totalInvoiceAmount) + Number(totalInterestAmount)) - Number(totalPaymentAmount)).toFixed(2)}</p>
                            <Button label="Payment Entry" type="button" className="p-mt-2" onClick={handlePaymentClick} />
                            <br/>
                            <Button label="New Month" type="button" className="p-mt-2"  onClick={handleNewMonth}/>
                        </Card>
                    </div>
                    <TabView>
                        <TabPanel header="Interest Transactions">
                            <DataTable value={interestData} paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="createdAt" header="Date" sortable></Column>
                                <Column field="vendorId.name" header="Vendor" sortable></Column>
                                <Column field="invoiceAmount" header="Invoice Amount" sortable></Column>
                                <Column field="interestAmount" header="Interest Amount" sortable></Column>
                                {/* <Column field="perdayInterestRate" header="Per Day Interest Rate" sortable></Column> */}
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Payment Transactions">
                            <DataTable value={paymentTransactions} paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="createdAt" header="Payment Date" sortable></Column>
                                <Column field="vendorId.name" header="Vendor" sortable></Column>
                                <Column field="paidAmount" header="Amount" sortable></Column>
                            </DataTable>
                        </TabPanel>
                    </TabView>

                </>
            ) : (
                <p style={{ marginTop: '1rem', color: '#888' }}>No application data found for the selected date range.</p>
            )}






            <Dialog header="Make a Payment" visible={isModalVisible} style={{ width: '30vw' }} onHide={() => setModalVisible(false)}>
                <div className="p-field">
                    <label htmlFor="paymentAmount">Payment Amount</label><br />
                    <input
                        type="number"
                        id="paymentAmount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="p-inputtext p-component"
                        placeholder="Enter amount"
                    />
                </div>
                <div className="p-field p-text-right">
                    <Button label="Pay" onClick={handlePaymentSubmit} />
                </div>
            </Dialog>
        </div>
    );
};

export default ApplicationsDetails;