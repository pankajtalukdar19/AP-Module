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
  const [interestSummary, setInterestSummary] = useState<any>();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadInterests();
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

  const amountTemplate = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const rateTemplate = (rowData: any) => {
    return `${(rowData.interestRate * 100).toFixed(2)}%`;
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />
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
      <Card title="Interest Overview">
        <DataTable
          value={interests}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No interest records found"
        >
          <Column field="userID.name" header="Vendor Name" sortable />
          <Column
            field="applicationId.invoiceAmount"
            header="Invoice Amount"
            body={(rowData) =>
              amountTemplate(rowData.applicationId.invoiceAmount)
            }
            sortable
          />
          <Column
            field="applicationId.calculatedInvoiceAmount"
            header="Principal Amount"
            body={(rowData) =>
              amountTemplate(rowData.applicationId.calculatedInvoiceAmount)
            }
            sortable
          />
          <Column
            field="dailyInterest"
            header="Daily Interest"
            body={(rowData) => amountTemplate(rowData.dailyInterest)}
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
