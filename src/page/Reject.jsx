
import mailservice from 'service/mailService';
import { useSearchParams } from 'react-router-dom';



import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Reject = () => {
    const [data, setData] = useState(null);
    const [selectedFields, setSelectedFields] = useState({});
    const [remarks, setRemarks] = useState({});
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        const fetchData = async () => {
            const response = await mailservice.getDataById(id)
            setData(response?.data?.data);
        };

        fetchData();
    }, []);

    const handleFieldSelect = (fieldName) => {
        setSelectedFields((prev) => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    const handleRemarksChange = (e, fieldName) => {
        const { value } = e.target;
        setRemarks((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSubmit = async  (e) => {
        e.preventDefault();
        const selectedData = {};
        
        if (selectedFields.department) {
            selectedData.department = data.department;
            selectedData.departmentRemarks = remarks.department || "";
        }
        if (selectedFields.invoiceAmount) {
            selectedData.invoiceAmount = data.invoiceAmount;
            selectedData.invoiceAmountRemarks = remarks.invoiceAmount || "";
        }
        if (selectedFields.invoiceNumber) {
            selectedData.invoiceNumber = data.invoiceNumber;
            selectedData.invoiceNumberRemarks = remarks.invoiceNumber || "";
        }
        if (selectedFields.paymentCondition) {
            selectedData.paymentCondition = data.paymentCondition;
            selectedData.paymentConditionRemarks = remarks.paymentCondition || "";
        }
        if (data?.userEmail) {
            selectedData.userEmail = data.userEmail;
        }
        if (selectedFields.vendorName) {
            selectedData.vendorName = data.vendorName;
            selectedData.vendorNameRemarks = remarks.vendorName || "";
        }
        
         await mailservice.applicationReject(selectedData)
    };

    if (!data) return <p>Loading...</p>;

    return (
        <Card title="Reject Form" className="my-4">
            <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-grid">
                    <div className="p-col-12 p-md-6 p-field">
                        <label>Department</label>
                        <br/>
                        <Checkbox
                            inputId="department"
                            onChange={() => handleFieldSelect('department')}
                            checked={!!selectedFields.department}
                        />
                        <label htmlFor="department">{data.department}</label>
                        {selectedFields.department && (
                            <InputText
                                placeholder="Remarks"
                                value={remarks.department || ''}
                                onChange={(e) => handleRemarksChange(e, 'department')}
                                className="mt-2"
                            />
                        )}
                    </div>

                    <div className="p-col-12 p-md-6 p-field">
                        <label>Invoice Amount</label>
                        <br/>
                        <Checkbox
                            inputId="invoiceAmount"
                            onChange={() => handleFieldSelect('invoiceAmount')}
                            checked={!!selectedFields.invoiceAmount}
                        />
                        <label htmlFor="invoiceAmount">{data.invoiceAmount}</label>
                        {selectedFields.invoiceAmount && (
                            <InputText
                                placeholder="Remarks"
                                value={remarks.invoiceAmount || ''}
                                onChange={(e) => handleRemarksChange(e, 'invoiceAmount')}
                                className="mt-2"
                            />
                        )}
                    </div>

                    <div className="p-col-12 p-md-6 p-field">
                        <label>Invoice Number</label>
                        <br/>
                        <Checkbox
                            inputId="invoiceNumber"
                            onChange={() => handleFieldSelect('invoiceNumber')}
                            checked={!!selectedFields.invoiceNumber}
                        />
                        <label htmlFor="invoiceNumber">{data.invoiceNumber}</label>
                        {selectedFields.invoiceNumber && (
                            <InputText
                                placeholder="Remarks"
                                value={remarks.invoiceNumber || ''}
                                onChange={(e) => handleRemarksChange(e, 'invoiceNumber')}
                                className="mt-2"
                            />
                        )}
                    </div>

                    <div className="p-col-12 p-md-6 p-field">
                        <label>Payment Condition</label>
                        <br/>
                        <Checkbox
                            inputId="paymentCondition"
                            onChange={() => handleFieldSelect('paymentCondition')}
                            checked={!!selectedFields.paymentCondition}
                        />
                        <label htmlFor="paymentCondition">{data.paymentCondition}</label>
                        {selectedFields.paymentCondition && (
                            <InputText
                                placeholder="Remarks"
                                value={remarks.paymentCondition || ''}
                                onChange={(e) => handleRemarksChange(e, 'paymentCondition')}
                                className="mt-2"
                            />
                        )}
                    </div>


                    <div className="p-col-12 p-md-6 p-field">
                        <label>Vendor Name</label>
                        <br/>
                        <Checkbox
                            inputId="vendorName"
                            onChange={() => handleFieldSelect('vendorName')}
                            checked={!!selectedFields.vendorName}
                            
                        />
                        <label htmlFor="vendorName">{data.vendorName}</label>
                        {selectedFields.vendorName && (
                            <InputText
                                placeholder="Remarks"
                                value={remarks.vendorName || ''}
                                onChange={(e) => handleRemarksChange(e, 'vendorName')}
                                className="mt-2"
                            />
                        )}
                    </div>
                </div>

                <div className="p-col-12">
                    <Button label="Submit" type="submit" className=" mt-3" />
                </div>
            </form>
        </Card>
    );
};

export default Reject;