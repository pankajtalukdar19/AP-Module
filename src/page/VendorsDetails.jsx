import React, { useEffect, useState } from 'react';
import interestService from 'service/interestService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';  
import 'primeflex/primeflex.css';
import paymentService from 'service/paymentService';
import { TabView, TabPanel } from 'primereact/tabview';
import * as moment from 'moment'
import { useParams } from 'react-router-dom';
import mailservice from 'service/mailService';


const VendorsDetails = () => {
    const [vendorData, setVendorData] = useState([]);
    const { id } = useParams(); 
    const [paymentTransactions, setPaymentTransactions] = useState([]);

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY hh:mm A')
    }

    const getPaymentData = async () => {
        console.log(id);
        
        try {
            const response = await paymentService.paymentDataById(id)
            console.log(response?.data?.data);
            
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
            const response = await mailservice.getallDataByID(id);
            setVendorData(
                response?.data?.data.map((i) => ({
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
 

    return (
        <div className="p-grid p-justify-center p-mt-4"> 
            {vendorData.length > 0 ? (
                <>
                     
                    <TabView>
                        <TabPanel header="Interest Transactions">
                            <DataTable value={vendorData} paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="createdAt" header="Date" sortable></Column>
                                <Column field="vendorName.name" header="Vendor" sortable></Column>
                                <Column field="invoiceAmount" header="Invoice Amount" sortable></Column>
                                <Column field="perdayInterestRate" header="Per Day Interest Rate" sortable></Column>
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
        </div>
    );
};

export default VendorsDetails;