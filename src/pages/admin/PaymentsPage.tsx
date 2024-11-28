import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { paymentsApi } from "@api/payments.api";
import { formatDate } from "@utils/index";

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response: any = await paymentsApi.getAllPayments();
      setPayments(response.data.data);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
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
      <div className="flex gap-2">
        <Button
          icon="pi pi-check"
          rounded
          text
          severity="success"
          onClick={() => handleUpdateStatus(rowData._id, "completed")}
          disabled={rowData.status === "completed"}
        />
        <Button
          icon="pi pi-times"
          rounded
          text
          severity="danger"
          onClick={() => handleUpdateStatus(rowData._id, "failed")}
          disabled={rowData.status === "failed"}
        />
        <Button
          icon="pi pi-file-pdf"
          rounded
          text
          severity="info"
          onClick={() => window.open(rowData.invoiceUrl, "_blank")}
        />
      </div>
    );
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      await paymentsApi.updatePaymentStatus(id, status);
      loadPayments();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div className="card">
      <DataTable
        value={payments}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        sortField="createdAt"
        sortOrder={-1}
      >
        <Column field="vendorId.businessName" header="Business Name" sortable />
        <Column field="vendorId.name" header="Vendor Name" sortable />
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
    </div>
  );
}

export default PaymentsPage;
