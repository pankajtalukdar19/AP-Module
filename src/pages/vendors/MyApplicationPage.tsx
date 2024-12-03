import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import { applicationsApi } from "@api/applications.api";
import { formatDate } from "@utils/index";
import { useAppSelector } from "@/hooks/reduxHook";
import NodataFound from "@components/NodataFound";

function MyApplicationPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const getApplication = async () => {
      try {
        setLoading(true);
        const response: any = await applicationsApi.getApplicationsByVendorId(
          user?._id || ""
        );

        // Filter and map applications by status
        setApprovedApplications(
          response?.data
            ?.map((i: any) => ({
              ...i,
              dueDate: formatDate(i.dueDate),
              invoiceDate: formatDate(i.invoiceDate),
              paymentDate: formatDate(i.paymentDate),
            }))
            .filter((app: any) => app.status === "approved") || []
        );

        setPendingApplications(
          response?.data
            ?.map((i: any) => ({
              ...i,
              dueDate: formatDate(i.dueDate),
              invoiceDate: formatDate(i.invoiceDate),
              paymentDate: formatDate(i.paymentDate),
            }))
            .filter((app: any) => app.status === "pending") || []
        );

        setRejectedApplications(
          response?.data
            ?.map((i: any) => ({
              ...i,
              dueDate: formatDate(i.dueDate),
              invoiceDate: formatDate(i.invoiceDate),
              paymentDate: formatDate(i.paymentDate),
            }))
            .filter((app: any) => app.status === "rejected") || []
        );
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      getApplication();
    }
  }, [user?._id]);

  const statusBodyTemplate = (rowData: any) => {
    const severity: any = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    };

    return <Tag value={rowData.status} severity={severity[rowData.status]} />;
  };

  const amountBodyTemplate = (rowData: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.invoiceAmount);
  };
console.log(pendingApplications);

  return (
    <div className="card">
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
          >
            <Column
              field="invoiceAmount"
              header="Invoice Amount"
              body={amountBodyTemplate}
              sortable
            />
            <Column field="invoiceDate" header="Invoice Date" sortable />
            <Column field="paymentDate" header="Payment Date" sortable />
            <Column field="dueDate" header="Due Date" sortable />
            <Column field="invoiceNumber" header="Invoice Number" sortable />
            <Column
              field="paymentCondition"
              header="Payment Condition"
              sortable
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
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
          >
            <Column
              field="invoiceAmount"
              header="Invoice Amount"
              body={amountBodyTemplate}
              sortable
            />
            <Column field="invoiceDate" header="Invoice Date" sortable />
            <Column field="paymentDate" header="Payment Date" sortable />
            <Column field="dueDate" header="Due Date" sortable />
            <Column field="invoiceNumber" header="Invoice Number" sortable />
            <Column
              field="paymentCondition"
              header="Payment Condition"
              sortable
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
            />
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
          >
            <Column
              field="invoiceAmount"
              header="Invoice Amount"
              body={amountBodyTemplate}
              sortable
            />
            <Column field="invoiceDate" header="Invoice Date" sortable />
            <Column field="paymentDate" header="Payment Date" sortable />
            <Column field="dueDate" header="Due Date" sortable />
            <Column field="invoiceNumber" header="Invoice Number" sortable />
            <Column
              field="paymentCondition"
              header="Payment Condition"
              sortable
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
            />
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  );
}

export default MyApplicationPage;