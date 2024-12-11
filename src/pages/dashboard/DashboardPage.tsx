import { applicationsApi } from "@/api/applications.api";
import { interestApi } from "@/api/interest.api";
import { useAppSelector } from "@/hooks/reduxHook";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

type FormValues = {
  invoiceNumber: string;
  date: Date;
  invoiceDate: Date | null;
  paymentDate: Date | null;
  dueDate: Date | null;
  userEmail: string;
  department: string | null;
  userID: string;
  invoiceAmount: string;
  paymentCondition: string;
  partialRatio1: number | null;
  partialRatio2: number | null;
  invoiceCopy: File | null;
  status: string;
};


function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const toast = useRef<Toast>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<FormValues>({
    invoiceNumber: "",
    date: new Date(),
    invoiceDate: null,
    paymentDate: null,
    dueDate: null,
    userEmail: "",
    department: null,
    userID: user?._id || "",
    invoiceAmount: "",
    paymentCondition: "Full Payment",
    partialRatio1: null,
    partialRatio2: null,
    invoiceCopy: null,
    status: "pending",
  });

  const departments = [
    { label: "HMG", value: "HMG" },
    { label: "D2R", value: "D2R" },
  ];

  const paymentOptions = [
    { label: "Full Payment", value: "Full Payment" },
    { label: "Partial Payment", value: "Partial Payment" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: any) => {
    console.log('e', e?.files[0]);

    setFormValues((prevValues) => ({
      ...prevValues,
      invoiceCopy: e.files[0],
    }));
  };

  const handleRatioChange = (e: any, field: "partialRatio1" | "partialRatio2") => {
    const value = parseFloat(e.value);
    if (field === "partialRatio1") {
      setFormValues((prevValues) => ({
        ...prevValues,
        partialRatio1: value,
        partialRatio2: 100 - value,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        partialRatio2: value,
        partialRatio1: 100 - value,
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const dataToSubmit = {
      invoiceNumber: formValues.invoiceNumber,
      date: formValues.date,
      invoiceDate: formValues.invoiceDate,
      paymentDate: formValues.paymentDate,
      dueDate: formValues.dueDate,
      userEmail: formValues.userEmail,
      department: formValues.department,
      userID: user?._id,
      invoiceAmount: formValues.invoiceAmount,
      paymentCondition: formValues.paymentCondition,
      partialRatio1: formValues.paymentCondition === "Partial Payment" ? formValues.partialRatio1 : null,
      partialRatio2: formValues.paymentCondition === "Partial Payment" ? formValues.partialRatio2 : null,
      invoiceCopy: formValues.invoiceCopy,
      status: formValues.status,
    };

    console.log("dataToSubmit", dataToSubmit);
    


    try {
      const response = await applicationsApi.submitApplications(dataToSubmit);
      if (response?.data?.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Application submitted successfully",
          life: 3000,
        });

        setFormValues({
          invoiceNumber: "",
          date: new Date(),
          invoiceDate: null,
          paymentDate: null,
          dueDate: null,
          userEmail: "",
          department: null,
          userID: user?._id || "",
          invoiceAmount: "",
          paymentCondition: "Full Payment",
          partialRatio1: null,
          partialRatio2: null,
          invoiceCopy: null,
          status: "pending",
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to submit application",
        life: 3000,
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
        setFormValues((prevValues) => ({
          ...prevValues,
          dueDate,
        }));
      }
    };

    calculateDueDate();
  }, [formValues.invoiceDate, formValues.paymentDate]);

  const handleBillUpload = (e: any) => {
    const file = e.files?.[0]; // Get the uploaded file

    if (file) {
      const isImage = file.type.startsWith("image/");
      const isAllowedFile = /\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(file.name); // Allow specific file types

      if (!isAllowedFile) {
        toast.current?.show({
          severity: "error",
          summary: "Invalid File Type",
          detail: "Only images, PDFs, and Word documents are allowed.",
        });
        return;
      }

      if (file.size > 1000000) {
        // File size limit of 1MB
        toast.current?.show({
          severity: "error",
          summary: "File Too Large",
          detail: "Maximum file size is 1MB.",
        });
        return;
      }

      // setUploadedFile(file);
      setFormValues((prevValues) => ({
        ...prevValues,
        invoiceCopy: file,
      }));

      if (isImage) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const [interestSummary, setInterestSummary] = useState<any>(null);

  useEffect(() => { 
    loadInterestSummary()
  }, []);

  const loadInterestSummary = async () => {
    try {
      const response = await interestApi.getInterestAdminSummary();
      setInterestSummary(response.data.data);
    } catch (error) {
      console.error("Failed to load interest summary:", error);
    }
  };

  return user?.role === "vendor" ? (
    <Card className="p-shadow-3 forenax-wrapper" style={{ padding: "1rem" }}>

      <form onSubmit={handleSubmit} className="p-fluid compact-form">
        <Toast ref={toast} />
        {/* Form Content */}
        <div className="grid">
          {/* Department */}
          <div className="col-12 p-md-6 p-field">
            <label htmlFor="department">Department</label>
            <Dropdown
              id="department"
              name="department"
              value={formValues.department}
              options={departments}
              onChange={(e) => setFormValues((prevValues) => ({
                ...prevValues,
                ['department']: e.value,
              }))}
              placeholder="Select Department"
              required
              className="mb-2"
            />
          </div>

          {/* Invoice Number */}
          <div className="col-12 p-md-6 p-field">
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

          {/* Date */}
          <div className="col-12 p-md-6 p-field">
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

          {/* Invoice Date */}
          <div className="col-12 p-md-6 p-field">
            <label htmlFor="invoiceDate">Invoice Date</label>
            <Calendar
              id="invoiceDate"
              name="invoiceDate"
              value={formValues.invoiceDate}
              onChange={(e) => setFormValues(prevValues => ({ ...prevValues, invoiceDate: new Date(e.value || new Date()) }))}
              required
              dateFormat="dd/mm/yy"
              className="mb-2"
            />
          </div>

          {/* Payment Date */}
          <div className="col-12 p-md-6 p-field">
            <label htmlFor="paymentDate">Payment Date</label>
            <Calendar
              id="paymentDate"
              name="paymentDate"
              value={formValues.paymentDate}
              onChange={(e) => setFormValues(prevValues => ({ ...prevValues, paymentDate: new Date(e.value || new Date()) }))}
              required
              dateFormat="dd/mm/yy"
              className="mb-2"
            />
          </div>

          {/* Due Date */}
          <div className="col-12 p-md-6 p-field">
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

          {/* Invoice Amount */}
          <div className="col-12 p-md-6 p-field">
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

          {/* Upload Invoice Copy */}
          <div className="col-12 p-md-6 p-field">
            <label htmlFor="invoiceCopy">Upload Invoice Copy</label>
            <FileUpload
              mode="basic"
              name="invoiceCopy"
              accept="image/*, .pdf, .doc, .docx"
              maxFileSize={1000000}
              onSelect={handleBillUpload}
              auto={false}
            />


            {filePreview && (
              <div className="mt-3">
                <img
                  src={filePreview}
                  alt="Uploaded preview"
                  className="w-full border-round"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
            )}
          </div>



          {/* Payment Conditions */}
          <div className="col-12 p-md-12 p-field">
            <label>Payment Conditions</label>
            <div className="p-formgroup-inline">
              {paymentOptions.map((option) => (
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

          {/* Partial Payment Ratios */}
          {formValues.paymentCondition === "Partial Payment" && (
            <>
              <div className="col-12 p-md-6 p-field">
                <label htmlFor="partialRatio1">Amount to Pay Now (%)</label>
                <InputNumber
                  id="partialRatio1"
                  name="partialRatio1"
                  value={formValues.partialRatio1}
                  onChange={(e) => handleRatioChange(e, "partialRatio1")}
                  required
                />
              </div>
              <div className="col-12 p-md-6 p-field">
                <label htmlFor="partialRatio2">Amount Due Later (%)</label>
                <InputNumber
                  id="partialRatio2"
                  name="partialRatio2"
                  value={formValues.partialRatio2}
                  onChange={(e) => handleRatioChange(e, "partialRatio2")}
                  required
                />
              </div>
            </>
          )}
        </div>
        <div className="col-12 p-md-12 p-field">
          <Button type="submit" label="Submit" />
        </div>
      </form>
    </Card>
  ) : <>
    <div className="grid">
        <div className="col-12 md:col-3">
          <Card className="bg-blue-50">
            <div className="text-xl mb-2">Invoice Amount</div>
            <div className="text-2xl font-bold">
              {interestSummary?.totalInvoiceAmount?.toFixed(2)}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="bg-blue-50">
            <div className="text-xl mb-2">Principal Amount</div>
            <div className="text-2xl font-bold">
              {interestSummary?.totalPrincipleAmount?.toFixed(2)}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="bg-green-50">
            <div className="text-xl mb-2">Total Interest</div>
            <div className="text-2xl font-bold">
              {interestSummary?.totalInterest?.toFixed(2)}
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-3">
          <Card className="bg-purple-50">
            <div className="text-xl mb-2">Current Month Interest</div>
            <div className="text-2xl font-bold">
              {interestSummary?.currentMonthInterest?.toFixed(2)}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="bg-purple-50">
            <div className="text-xl mb-2">Limit Left</div>
            <div className="text-2xl font-bold">
              {interestSummary?.limitLeft?.toFixed(2)}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="bg-purple-50">
            <div className="text-xl mb-2">Application Count</div>
            <div className="text-2xl font-bold">
              {interestSummary?.applicationCount}
            </div>
          </Card>
        </div>
      </div>
  </>;
}

export default DashboardPage;