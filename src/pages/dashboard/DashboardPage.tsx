import { applicationsApi } from "@/api/applications.api";
import { useAppSelector } from "@/hooks/reduxHook";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from "react";

function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const toast = useRef(null);
  const [vendorName, setVendorName] = useState([])
  const [formValues, setFormValues] = useState({
    invoiceNumber: '',
    date: new Date(),
    invoiceDate: null,
    paymentDate: null,
    dueDate: null,
    userEmail: '',
    department: null,
    vendorName: '',
    invoiceAmount: '',
    paymentCondition: 'Full Payment',
    partialRatio1: null,
    partialRatio2: null,
    invoiceCopy: null,
    status: "pending",
  });

  const departments = [
    { label: 'HMG', value: 'HMG' },
    { label: 'D2R', value: 'D2R' }
  ];


  const paymentOptions = [
    { label: 'Full Payment', value: 'Full Payment' },
    { label: 'Partial Payment', value: 'Partial Payment' }
  ];

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    setFormValues(prevValues => ({
      ...prevValues,
      invoiceCopy: e.files[0]
    }));
  };

  const handleRatioChange = (e:any, field:any) => {
    const value = parseFloat(e.target.value);
    if (field === 'partialRatio1') {
      setFormValues(prevValues => ({
        ...prevValues,
        partialRatio1: value,
        partialRatio2: 100 - value
      }));
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        partialRatio2: value,
        partialRatio1: 100 - value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      invoiceNumber: formValues.invoiceNumber,
      date: formValues.date,
      invoiceDate: formValues.invoiceDate,
      paymentDate: formValues.paymentDate,
      dueDate: formValues.dueDate,
      userEmail: formValues.userEmail,
      department: formValues.department,
      vendorName: formValues.name,
      invoiceAmount: formValues.invoiceAmount,
      calculatedInvoiceAmount: formValues.invoiceAmount,
      paymentCondition: formValues.paymentCondition,
      invoiceCopy: formValues.invoiceCopy,
      status: formValues.status,
    };
    // if (formValues.paymentCondition === 'Partial Payment') {
    //     dataToSubmit.partialRatio1 = formValues.partialRatio1;
    //     dataToSubmit.partialRatio2 = formValues.partialRatio2;
    // }
    const response = await applicationsApi.submitApplications(dataToSubmit);

    if (response?.data?.success) {
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Application submitted successfully', life: 3000 });

      setFormValues({
        invoiceNumber: '',
        date: new Date(),
        invoiceDate: null,
        paymentDate: null,
        dueDate: null,
        userEmail: '',
        department: null,
        vendorName: '',
        invoiceAmount: '',
        paymentCondition: 'Full Payment',
        partialRatio1: '',
        partialRatio2: '',
        invoiceCopy: null,
      });
    }
  };

  useEffect(() => {
    const calculateDueDate = () => {
      if (formValues.invoiceDate && formValues.paymentDate) {
        const invoiceDueDate = new Date(formValues.invoiceDate);
        invoiceDueDate.setDate(invoiceDueDate.getDate() + 120);

        const paymentDueDate = new Date(formValues.paymentDate);
        paymentDueDate.setDate(paymentDueDate.getDate() + 90);

        const dueDate = invoiceDueDate < paymentDueDate ? invoiceDueDate : paymentDueDate;
        setFormValues(prevValues => ({
          ...prevValues,
          dueDate
        }));
      }
    };

    calculateDueDate();
  }, [formValues.invoiceDate, formValues.paymentDate]);

  useEffect(() => {
    const getVendorName = async () => {
      const response = await vendorService.getVendorname()
      setVendorName(response?.data.data)
    };

    getVendorName();
  }, []);
  return <>
    {
      user?.role == "vendor" ? (
        <>
          <Card className=" p-shadow-3 forenax-wrapper" style={{ padding: '1rem' }} >

            <form onSubmit={handleSubmit} className="p-fluid compact-form">
              <Toast ref={toast} />
              <div className="grid">
                <div className="p-col-12 p-md-6 p-field">
                  <label htmlFor="userEmail">User E-Mail ID</label>
                  <InputText
                    id="userEmail"
                    name="userEmail"
                    value={formValues.userEmail}
                    onChange={handleInputChange}
                    required
                    className="mb-2"
                  />
                </div>

                <div className="p-col-12 p-md-6 p-field">
                  <label htmlFor="department">Department</label>
                  <Dropdown
                    id="department"
                    name="department"
                    value={formValues.department}
                    options={departments}
                    onChange={handleInputChange}
                    placeholder="Select Department"
                    required
                    className="mb-2"
                  />
                </div>

                <div className="p-col-12 p-md-6 p-field">
                  <label htmlFor="invoiceNumber">Invoice Number</label>
                  <InputText
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formValues.invoiceNumber}
                    onChange={handleInputChange}
                    required
                    className="mb-2"
                  />
                </div>

                <div className="p-col-12 p-md-6 p-field">
                  <label htmlFor="date">Date</label>
                  <Calendar
                    id="date"
                    name="date"
                    value={formValues.date}
                    disabled
                    dateFormat="dd/mm/yy"
                    className="mb-2"
                  />
                </div>
                <div className="grid">
                  <div className="p-col-12 p-md-6 p-field">
                    <label htmlFor="invoiceDate">Invoice Date</label>
                    <Calendar
                      id="invoiceDate"
                      name="invoiceDate"
                      value={formValues.invoiceDate}
                      onChange={(e) => setFormValues(prevValues => ({ ...prevValues, invoiceDate: e.value }))}
                      required
                      dateFormat="dd/mm/yy"
                      className="mb-2"
                    />
                  </div>
                  <div className="p-col-12 p-md-6 p-field">
                    <label htmlFor="paymentDate">Payment Date</label>
                    <Calendar
                      id="paymentDate"
                      name="paymentDate"
                      value={formValues.paymentDate}
                      onChange={(e) => setFormValues(prevValues => ({ ...prevValues, paymentDate: e.value }))}
                      required
                      dateFormat="dd/mm/yy"
                      className="mb-2"
                    />
                  </div>
                  <div className="p-col-12 p-md-6 p-field">
                    <label htmlFor="dueDate">Due Date</label>
                    <Calendar
                      id="dueDate"
                      name="dueDate"
                      value={formValues.dueDate}
                      disabled
                      dateFormat="dd/mm/yy"
                      className="mb-2"
                    />
                  </div>
                </div>

                <div className="p-col-12 p-md-6 p-field">
                  <label htmlFor="name">Vendor Name</label>
                  <Dropdown
                    id="name"
                    name="name"
                    value={formValues.name}
                    options={vendorName}
                    onChange={handleInputChange}
                    placeholder="Select vendor name"
                    required
                    optionLabel="name"
                    optionValue="_id"

                    className="mb-2"
                  />
                </div>

                <div className="p-col-12 p-md-6 p-field">
                  <label htmlFor="invoiceAmount">Invoice Amount</label>
                  <InputText
                    id="invoiceAmount"
                    name="invoiceAmount"
                    value={formValues.invoiceAmount}
                    onChange={handleInputChange}
                    required
                    className="mb-2"

                  />
                </div>

                <div className="p-col-12 p-md-6 p-field">
                  <label htmlFor="invoiceCopy">Upload Invoice Copy</label>
                  <FileUpload
                    id="invoiceCopy"
                    name="invoiceCopy"
                    accept=".pdf,.jpg,.png"
                    customUpload
                    auto
                    chooseLabel="Upload File"
                    onUpload={handleFileUpload}
                    className="mb-2"
                  />
                </div>

                <div className="p-col-12 p-md-12 p-field">
                  <label>Payment Conditions</label>
                  <div className="p-formgroup-inline">
                    {paymentOptions.map(option => (
                      <div key={option.value} className="p-field-radiobutton">
                        <RadioButton
                          inputId={option.value}
                          name="paymentCondition"
                          value={option.value}
                          onChange={(e) => setFormValues(prevValues => ({ ...prevValues, paymentCondition: e.value }))}
                          checked={formValues.paymentCondition === option.value}
                        />
                        <label htmlFor={option.value}>{option.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {formValues.paymentCondition === 'Partial Payment' && (
                  <div className="p-col-12 p-md-6 p-field">
                    <label htmlFor="partialRatio1">Amount to Pay Now (%)</label>
                    <InputText
                      id="partialRatio1"
                      name="partialRatio1"
                      value={formValues.partialRatio1}
                      onChange={(e) => handleRatioChange(e, 'partialRatio1')}
                      required
                    />
                  </div>
                )}
                {formValues.paymentCondition === 'Partial Payment' && (
                  <div className="p-col-12 p-md-6 p-field">
                    <label htmlFor="partialRatio2">Amount Due Later (%)</label>
                    <InputText
                      id="partialRatio2"
                      name="partialRatio2"
                      value={formValues.partialRatio2}
                      onChange={(e) => handleRatioChange(e, 'partialRatio2')}
                      required
                    />
                  </div>
                )}

                <div className="p-col-12 p-md-12 p-field">
                  <Button type="submit" label="Submit" />
                </div>
              </div>
            </form>
          </Card>
        </>
      ) : null
    }
  </>;
}

export default DashboardPage;
