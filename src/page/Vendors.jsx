import React, { useEffect, useState } from 'react';
import vendorService from 'service/vendorService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';


const Vendors = () => {
    const [interestData, setInterestData] = useState([]);

    const navigate = useNavigate(); // Use useNavigate hook for navigation

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await vendorService.getVendorname();
                setInterestData(response?.data?.data);
            } catch (error) {
                console.error('Error fetching application data:', error);
            }
        };

        getData();
    }, []);


    return (
        <>
            <DataTable value={interestData} paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Vendor" sortable></Column>
                <Column field="totalLoan" header="Total Loan" sortable></Column>
                <Column field="totalinterest" header="Total Intrest" sortable></Column>
                <Column field="totalPayment" header="Total paid" sortable></Column>

                <Column
                    header="Action"
                    body={(rowData) => (
                        <Button label="View" onClick={() => navigate('/vendors/' + rowData._id)} />
                    )}
                />
            </DataTable>
        </>
    );
};

export default Vendors;