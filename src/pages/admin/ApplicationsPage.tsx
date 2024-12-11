import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { applicationsApi } from "@api/applications.api";
import { formatDate } from "@utils/index";
import NodataFound from "@components/NodataFound";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface Application {
  _id: string;
  vendorId: {
    name: string;
    email: string;
    businessName: string;
  };
  invoiceAmount: number;
  calculatedInvoiceAmount: number;
  invoiceDate: string;
  paymentDate: string;
  dueDate: string;
  invoiceNumber: string;
  paymentCondition: string;
  status: "pending" | "approved" | "rejected";
}

function ApplicationsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [approvedApplications, setApprovedApplications] = useState<
    Application[]
  >([]);
  const [pendingApplications, setPendingApplications] = useState<Application[]>(
    []
  );
  const [rejectedApplications, setRejectedApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response: any = await applicationsApi.getApplications();

      // Filter and map applications by status
      const applications: any =
        response?.data?.map((app: Application) => ({
          ...app,
          dueDate: formatDate(app.dueDate),
          invoiceDate: formatDate(app.invoiceDate),
          paymentDate: formatDate(app.paymentDate),
        })) || [];

      setApprovedApplications(
        applications.filter((app: Application) => app.status === "approved")
      );
      setPendingApplications(
        applications.filter((app: Application) => app.status === "pending")
      );
      setRejectedApplications(
        applications.filter((app: Application) => app.status === "rejected")
      );
    } catch (error) {
      console.error("Error loading applications:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load applications",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: Application["status"]
  ) => {
    try {
      await applicationsApi.updateApplicationStatus(id, status);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: `Application ${status} successfully`,
      });
      loadApplications();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update application status",
      });
    }
  };

  const statusBodyTemplate = (rowData: Application) => {
    const severity = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    } as const;

    return <Tag value={rowData.status} severity={severity[rowData.status]} />;
  };

  const amountBodyTemplate = (rowData: Application) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.invoiceAmount);
  };

  const calculatedAmountBodyTemplate = (rowData: Application) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.calculatedInvoiceAmount);
  };

  const actionBodyTemplate = (rowData: Application) => {
    if (rowData.status === "pending") {
      return (
        <div className="flex gap-2">
          <Button
            icon="pi pi-check"
            rounded
            text
            severity="success"
            tooltip="Approve"
            tooltipOptions={{ position: "top" }}
            onClick={() => handleStatusChange(rowData._id, "approved")}
          />
          <Button
            icon="pi pi-times"
            rounded
            text
            severity="danger"
            tooltip="Reject"
            tooltipOptions={{ position: "top" }}
            onClick={() => handleStatusChange(rowData._id, "rejected")}
          />
        </div>
      );
    }
    return null;
  };

  const sharedColumns = [
    <Column
      key="businessName"
      field="userID.businessName"
      header="Business Name"
      sortable
    />,
    <Column
      key="vendorName"
      field="userID.name"
      header="Vendor Name"
      sortable
    />,
    <Column key="email" field="userID.email" header="Email" sortable />,
    <Column
      key="invoiceAmount"
      field="invoiceAmount"
      header="Invoice Amount"
      body={amountBodyTemplate}
      sortable
    />,
    <Column
      key="calculatedAmount"
      field="calculatedInvoiceAmount"
      header="Calculated Amount"
      body={calculatedAmountBodyTemplate}
      sortable
    />,
    <Column
      key="invoiceDate"
      field="invoiceDate"
      header="Invoice Date"
      sortable
    />,
    <Column
      key="paymentDate"
      field="paymentDate"
      header="Payment Date"
      sortable
    />,
    <Column key="dueDate" field="dueDate" header="Due Date" sortable />,
    <Column
      key="invoiceNumber"
      field="invoiceNumber"
      header="Invoice Number"
      sortable
    />,
    <Column
      key="paymentCondition"
      field="paymentCondition"
      header="Payment Condition"
      sortable
    />,
    <Column
      key="status"
      field="status"
      header="Status"
      body={statusBodyTemplate}
      sortable
    />,
  ];

  return (
    <div className="card">
      <Toast ref={toast} />
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header={`Pending (${pendingApplications.length})`}>
          <DataTable
            value={pendingApplications}
            loading={loading}
            emptyMessage={
              <NodataFound message="No pending applications found" />
            }
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            sortField="createdAt"
            sortOrder={-1}
          >
            {sharedColumns}
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ width: "10rem" }}
            />
          </DataTable>
        </TabPanel>

        <TabPanel header={`Approved (${approvedApplications.length})`}>
          <DataTable
            value={approvedApplications}
            loading={loading}
            emptyMessage={
              <NodataFound message="No approved applications found" />
            }
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            sortField="createdAt"
            sortOrder={-1}
          >
            {sharedColumns}
          </DataTable>
        </TabPanel>

        <TabPanel header={`Rejected (${rejectedApplications.length})`}>
          <DataTable
            value={rejectedApplications}
            loading={loading}
            emptyMessage={
              <NodataFound message="No rejected applications found" />
            }
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            sortField="createdAt"
            sortOrder={-1}
          >
            {sharedColumns}
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  );
}

export default ApplicationsPage;
