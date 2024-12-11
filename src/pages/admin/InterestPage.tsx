import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { interestApi } from "@/api/interest.api";
import { formatDate } from "@utils/index";

function InterestPage() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      setLoading(true);
      const response: any = await interestApi.getAllInterest();
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

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />

      <Card title="Interest Overview">
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
