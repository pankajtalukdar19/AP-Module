import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import mailservice from 'service/mailService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const Applications = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    const columns = [
        { field: 'vendorName.name', header: 'Vendor Name' },
        { field: 'invoiceAmount', header: 'Invoice Amount' },
        { field: 'invoiceDate', header: 'Invoice Date' },
        { field: 'paymentDate', header: 'Payment Date' },
        { field: 'dueDate', header: 'Due Date' },
        { field: 'userEmail', header: 'Email' },
        { field: 'invoiceNumber', header: 'Invoice Number' },
        { field: 'paymentCondition', header: 'Payment Condition' },
    ];
    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY')
    }

    useEffect(() => {
        const getApplication = async () => {
            const response = await mailservice.getApplications();
            setApplications(response?.data.data?.map((i) => ({
                ...i,
                dueDate: formatDate(i.dueDate),
                invoiceDate: formatDate(i.invoiceDate),
                paymentDate: formatDate(i.paymentDate)
            })) || []);
        };

        getApplication();
    }, []);



    return (
        <div className="card">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Approved">
                    <DataTable value={applications.filter(app => app.status === 'approved')} tableStyle={{ minWidth: '50rem' }}>
                        {columns.map((col, i) => (
                            <Column key={col.field} field={col.field} header={col.header} />
                        ))}

                        {/* Render the Action column separately */}
                        <Column
                            header="Action"
                            body={(rowData) => (
                                <Button label="View" onClick={() => navigate('/applications/' + rowData._id)} />
                            )}
                        />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Pending">
                    <DataTable value={applications.filter(app => app.status === 'pending')} tableStyle={{ minWidth: '50rem' }}>
                        {columns.map((col, i) => (
                            <Column key={col.field} field={col.field} header={col.header} />
                        ))}
                    </DataTable>
                </TabPanel>
                <TabPanel header="Rejected">
                    <DataTable value={applications.filter(app => app.status === 'rejected')} tableStyle={{ minWidth: '50rem' }}>
                        {columns.map((col, i) => (
                            <Column key={col.field} field={col.field} header={col.header} />
                        ))}
                    </DataTable>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default Applications;