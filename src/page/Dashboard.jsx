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
import mailservice from 'service/mailService';

const Dashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [interestData, setInterestData] = useState([]);
    const [vendorName, setVendorName] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentTransactions, setPaymentTransactions] = useState([]);
    const [applications, setApplications] = useState([]);

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY hh:mm A')
    }

    const getPaymentData = async () => {
        try {
            const response = await paymentService.paymentDataById(selectedId._id)
            setPaymentTransactions(response?.data.data?.map((i) => ({
                ...i,
                createdAt: formatDate(i.createdAt)
            })) || []);
            console.log('applications', applications);
            
        } catch (error) {
            console.log('payment error');

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = {};
            if (startDate) {
                data.startDate = startDate;
            }
            if (endDate) {
                data.endDate = endDate;
            }
            if (selectedId?._id) {
                data.vendorId = selectedId._id;
                await getPaymentData();
            }

            const response = await mailservice.getDataByDate(Object.keys(data).length ? data : {});

            setInterestData(
                response?.data?.interestData.map((i) => ({
                    ...i,
                    createdAt: formatDate(i.createdAt)
                })) || []
            );

        } catch (error) {
            console.error('Error fetching application data:', error);
            // alert('Error fetching data. Please try again.');
        }
    };

    useEffect(() => {
        const getVendorName = async () => {
            try {
                const response = await vendorService.getVendorname();
                setVendorName(response?.data.data || []);
            } catch (error) {
                console.error('Error fetching vendor names:', error);
            }
        };
    
        getVendorName();
    }, []);

    const totalInterestAmount = parseFloat(
        interestData.reduce((total, item) => {
            return total + (item.interestAmount || 0);
        }, 0).toFixed(2)
    );

    const totalInvoiceAmount = applications.reduce((total, item) => {
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
            vendorId: selectedId,
            paidAmount: paymentAmount
        }
        const res = await paymentService.payment(data)
        setModalVisible(false);
        setPaymentAmount('');
        getPaymentData()
    };

    useEffect(() => {
        const getApplication = async () => {
            try {
                const response = await mailservice.getApplications();
    
                // Filter the applications with status "approved"
                const approvedApplications = response?.data?.data?.filter((i) => i.status === 'approved');
    
                // Map over the filtered approved applications and format the dates
                setApplications(approvedApplications?.map((i) => ({
                    ...i,
                    dueDate: formatDate(i.dueDate),
                    invoiceDate: formatDate(i.invoiceDate),
                    paymentDate: formatDate(i.paymentDate),
                    createdAt: formatDate(i.createdAt)
                })) || []);
            } catch (error) {
                console.error('Error fetching application data:', error);
            }
        };
    
        getApplication();
    }, []);

    return (
        <div className="p-grid p-justify-center p-mt-4">
            <Card className="p-col-12 p-md-10 p-lg-8 p-shadow-3" style={{ padding: '2rem' }}>
                <Panel header="Get Application Data by Date Range" className="p-mb-3">
                    <form onSubmit={handleSubmit} className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-inputtext p-component"
                            />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-inputtext p-component"
                            />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="vendor">Vendor Name</label>
                            <Dropdown
                                id="vendor"
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.value)}
                                options={vendorName}
                                optionLabel="name"
                                placeholder="Select a Vendor"
                                className="p-inputtext p-component"
                            />
                        </div>
                        <div className="p-field p-col-12 p-text-right">
                            <Button label="Search" type="submit" className=" p-mt-2" />
                        </div>
                    </form>
                </Panel>
            </Card>

            {applications.length > 0 ? (
                <>
                    <div className="result">
                        <Card title="Vendor Name" className="mr-2 p-shadow-3" style={{ padding: '1rem' }}>
                            <p className="m-0">{selectedId?.name}</p>
                        </Card>
                        <Card title="Limit Left" className="mr-2 p-shadow-3" style={{ padding: '1rem' }}>
                            <p className="m-0">{1000000 - totalInvoiceAmount }</p>
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
                            <p className="m-0">Total Overdue : {(Number(totalInvoiceAmount) + Number(totalInterestAmount)) - Number(totalPaymentAmount)}</p>
                            <Button label="Payment Entry" type="button" className="p-mt-2" onClick={handlePaymentClick} />
                        </Card>
                    </div>
                    <TabView>
                        <TabPanel header="Interest Transactions">
                            <DataTable value={applications} paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="createdAt" header="Date" sortable></Column>
                                <Column field="vendorName.name" header="Vendor" sortable></Column>
                                <Column field="invoiceAmount" header="Invoice Amount" sortable></Column>
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

export default Dashboard;