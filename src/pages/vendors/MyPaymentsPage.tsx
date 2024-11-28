import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { CreatePaymentRequest, paymentsApi } from "@api/payments.api";
import { formatDate } from "@utils/index";

const paymentMethods = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Cash", value: "cash" },
  { label: "Cheque", value: "cheque" },
];

function MyPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useState<CreatePaymentRequest>({
    amount: 0,
    paymentDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    paymentMethod: "bank_transfer",
    description: "",
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response: any = await paymentsApi.getVendorPayments();
      setPayments(response.data.data);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await paymentsApi.createPayment(formData);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Payment created successfully",
      });
      setDialogVisible(false);
      loadPayments();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create payment",
      });
    }
  };

  const statusBodyTemplate = (rowData: any) => {
    const severity: any = {
      pending: "warning",
      completed: "success",
      failed: "danger",
    };

    return <Tag value={rowData.status} severity={severity[rowData.status]} />;
  };

  const amountBodyTemplate = (rowData: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.amount);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon="pi pi-file-pdf"
        rounded
        text
        severity="info"
        onClick={() => window.open(rowData.invoiceUrl, "_blank")}
      />
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />

      <div className="flex justify-content-between mb-4">
        <h1 className="text-xl font-bold">My Payments</h1>
        <Button
          label="Create Payment"
          icon="pi pi-plus"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <DataTable
        value={payments}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        sortField="createdAt"
        sortOrder={-1}
      >
        <Column
          field="amount"
          header="Amount"
          body={amountBodyTemplate}
          sortable
        />
        <Column
          field="paymentDate"
          header="Payment Date"
          body={(rowData) => formatDate(rowData.paymentDate)}
          sortable
        />
        <Column
          field="dueDate"
          header="Due Date"
          body={(rowData) => formatDate(rowData.dueDate)}
          sortable
        />
        <Column field="paymentMethod" header="Payment Method" sortable />
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ width: "10rem" }}
        />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header="Create Payment"
        modal
        className="p-fluid"
        style={{ width: "50vw" }}
      >
        <div className="flex flex-column gap-3">
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <InputNumber
              id="amount"
              value={formData.amount}
              onValueChange={(e) =>
                setFormData({ ...formData, amount: e.value || 0 })
              }
              mode="currency"
              currency="USD"
            />
          </div>

          <div className="field">
            <label htmlFor="paymentDate">Payment Date</label>
            <Calendar
              id="paymentDate"
              value={new Date(formData.paymentDate)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentDate:
                    e.value?.toISOString() || new Date().toISOString(),
                })
              }
              showIcon
            />
          </div>

          <div className="field">
            <label htmlFor="dueDate">Due Date</label>
            <Calendar
              id="dueDate"
              value={new Date(formData.dueDate)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dueDate: e.value?.toISOString() || new Date().toISOString(),
                })
              }
              showIcon
            />
          </div>

          <div className="field">
            <label htmlFor="paymentMethod">Payment Method</label>
            <Dropdown
              id="paymentMethod"
              value={formData.paymentMethod}
              options={paymentMethods}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.value })
              }
              placeholder="Select Payment Method"
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={() => setDialogVisible(false)}
          />
          <Button label="Create" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      </Dialog>
    </div>
  );
}

export default MyPaymentsPage;
