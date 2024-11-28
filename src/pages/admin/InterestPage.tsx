import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { interestApi } from "@/api/interest.api";
import { formatDate } from "@utils/index";

function InterestPage() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadInterests();
  }, [date]);

  const loadInterests = async () => {
    try {
      setLoading(true);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const response: any = await interestApi.getAllInterest(month, year);
      setInterests(response.data.data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load interest data",
      });
    } finally {
      setLoading(false);
    }
  };

  const amountTemplate = (rowData: any, field: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rowData[field]);
  };

  const rateTemplate = (rowData: any) => {
    return `${(rowData.interestRate * 100).toFixed(2)}%`;
  };

  const applicationsSummaryTemplate = (rowData: any) => {
    const total = rowData.applications.reduce(
      (sum: number, app: any) => sum + app.amount,
      0
    );
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />

      <Card title="Interest Overview">
        <div className="flex justify-content-end mb-4">
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value || new Date())}
            view="month"
            dateFormat="mm/yy"
          />
        </div>

        <DataTable
          value={interests}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No interest records found"
        >
          <Column
            field="vendorId.businessName"
            header="Business Name"
            sortable
          />
          <Column field="vendorId.name" header="Vendor Name" sortable />
          <Column
            field="principalAmount"
            header="Principal Amount"
            body={(rowData) => amountTemplate(rowData, "principalAmount")}
            sortable
          />
          <Column
            field="dailyInterest"
            header="Daily Interest"
            body={(rowData) => amountTemplate(rowData, "dailyInterest")}
            sortable
          />
          <Column
            field="totalInterest"
            header="Total Interest"
            body={(rowData) => amountTemplate(rowData, "totalInterest")}
            sortable
          />
          <Column
            field="interestRate"
            header="Interest Rate"
            body={rateTemplate}
            sortable
          />
          <Column
            field="applications"
            header="New Applications"
            body={applicationsSummaryTemplate}
            sortable
          />
          <Column
            field="lastCalculatedDate"
            header="Last Calculated"
            body={(rowData) => formatDate(rowData.lastCalculatedDate)}
            sortable
          />
        </DataTable>
      </Card>
    </div>
  );
}

export default InterestPage;
