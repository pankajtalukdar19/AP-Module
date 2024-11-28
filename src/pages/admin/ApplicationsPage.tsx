import { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { formatDate } from "@/utils/dateUtils";
import { applicationsApi } from "@/api/applications.api";
function ApplicationsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "vendorName.name", header: "Vendor Name" },
    { field: "invoiceAmount", header: "Invoice Amount" },
    { field: "invoiceDate", header: "Invoice Date" },
    { field: "paymentDate", header: "Payment Date" },
    { field: "dueDate", header: "Due Date" },
    { field: "userEmail", header: "Email" },
    { field: "invoiceNumber", header: "Invoice Number" },
    { field: "paymentCondition", header: "Payment Condition" },
  ];

  useEffect(() => {
    const getApplication = async () => {
      const response = await applicationsApi.getApplications();
      setApprovedApplications(
        response?.data.data
          ?.map((i: any) => ({
            ...i,
            dueDate: formatDate(i.dueDate),
            invoiceDate: formatDate(i.invoiceDate),
            paymentDate: formatDate(i.paymentDate),
          }))
          .filter((app: any) => app.status === "approved") || []
      );

      setPendingApplications(
        response?.data.data
          ?.map((i: any) => ({
            ...i,
            dueDate: formatDate(i.dueDate),
            invoiceDate: formatDate(i.invoiceDate),
            paymentDate: formatDate(i.paymentDate),
          }))
          .filter((app: any) => app.status === "pending") || []
      );

      setRejectedApplications(
        response?.data.data
          ?.map((i: any) => ({
            ...i,
            dueDate: formatDate(i.dueDate),
            invoiceDate: formatDate(i.invoiceDate),
            paymentDate: formatDate(i.paymentDate),
          }))
          .filter((app: any) => app.status === "rejected") || []
      );
    };

    getApplication();
  }, []);

  return (
    <div className="card">
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Approved">
          <DataTable
            value={approvedApplications}
            tableStyle={{ minWidth: "50rem" }}
          >
            {columns.map((col, i) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}

            {/* Render the Action column separately */}
            <Column
              header="Action"
              body={(rowData) => (
                <Button
                  label="View"
                  onClick={() => navigate("/applications/" + rowData._id)}
                />
              )}
            />
          </DataTable>
        </TabPanel>
        <TabPanel header="Pending">
          <DataTable
            value={pendingApplications}
            tableStyle={{ minWidth: "50rem" }}
          >
            {columns.map((col, i) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </TabPanel>
        <TabPanel header="Rejected">
          <DataTable
            value={rejectedApplications}
            tableStyle={{ minWidth: "50rem" }}
          >
            {columns.map((col, i) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  );
}

export default ApplicationsPage;
