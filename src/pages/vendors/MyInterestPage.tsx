import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { interestApi } from "@/api/interest.api";

function MyInterestPage() {
  const [interestDetail, setInterestDetail] = useState<any>(null);
  const [interestSummary, setInterestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadInterestData();
    loadInterestSummary();
  }, []);

  const loadInterestData = async () => {
    try {
      setLoading(true);
      const response = await interestApi.getVendorInterest();
      setInterestDetail(response.data.data);
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

  const loadInterestSummary = async () => {
    try {
      const response = await interestApi.getInterestSummary();
      setInterestSummary(response.data.data);
    } catch (error) {
      console.error("Failed to load interest summary:", error);
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

  const rateTemplate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />

      {/* Summary Cards */}
      <div className="grid">
        <div className="col-12 md:col-3">
          <Card className="bg-blue-50">
            <div className="text-xl mb-2">Principal Amount</div>
            <div className="text-2xl font-bold">
              {amountTemplate(interestSummary?.principalAmount || 0)}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="bg-green-50">
            <div className="text-xl mb-2">Daily Interest</div>
            <div className="text-2xl font-bold">
              {amountTemplate(interestSummary?.dailyInterest || 0)}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="bg-yellow-50">
            <div className="text-xl mb-2">Total Interest</div>
            <div className="text-2xl font-bold">
              {amountTemplate(interestSummary?.totalInterest || 0)}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="bg-purple-50">
            <div className="text-xl mb-2">Interest Rate</div>
            <div className="text-2xl font-bold">
              {rateTemplate(interestDetail?.interestRate || 0)}
            </div>
          </Card>
        </div>
      </div>

      {/* Monthly Details */}
      <Card title="Monthly Interest Details">
        <DataTable
          value={interestDetail || []}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No interest records found"
        >
          <Column
            field="principalAmount"
            header="Principal Amount"
            body={(rowData) => amountTemplate(rowData?.principalAmount || 0)}
            sortable
          />
          <Column
            field="dailyInterest"
            header="Daily Interest"
            body={(rowData) => amountTemplate(rowData?.dailyInterest || 0)}
            sortable
          />
          <Column
            field="totalInterest"
            header="Total Interest"
            body={(rowData) => amountTemplate(rowData?.totalInterest || 0)}
            sortable
          />
          <Column
            field="interestRate"
            header="Interest Rate"
            body={rateTemplate}
            sortable
          />
        </DataTable>
      </Card>

      {/* Monthly Summary */}
      <Card title="Monthly Summary">
        <div className="grid">
          <div className="col-12 md:col-4">
            <div className="text-lg mb-2">Opening Balance</div>
            <div className="text-xl">
              {amountTemplate(interestDetail?.principalAmount || 0)}
            </div>
          </div>
          <div className="col-12 md:col-4">
            <div className="text-lg mb-2">Interest Accumulated</div>
            <div className="text-xl">
              {amountTemplate(interestDetail?.totalInterest || 0)}
            </div>
          </div>
          <div className="col-12 md:col-4">
            <div className="text-lg mb-2">Closing Balance</div>
            <div className="text-xl">
              {amountTemplate(
                (interestDetail?.principalAmount || 0) +
                  (interestDetail?.totalInterest || 0)
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MyInterestPage;
