import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { interestApi } from "@/api/interest.api";
import { formatDate } from "@utils/index";

function MyInterestPage() {
  const [interestDetail, setInterestDetail] = useState<any>(null);
  const [interestSummary, setInterestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadInterestData();
    loadInterestSummary();
  }, [date]);

  const loadInterestData = async () => {
    try {
      setLoading(true);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const response = await interestApi.getVendorInterest(month, year);
      setInterestDetail(response.data.data);
    } catch (error) {

      setInterestDetail(null);
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
        <div className="flex justify-content-end mb-4">
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value || new Date())}
            view="month"
            dateFormat="mm/yy"
          />
        </div>

        <DataTable
          value={interestDetail || []}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No interest records found"
        >
          <Column
            field="applicationId.invoiceNumber"
            header="Invoice Number"
            sortable
          />

          <Column
            field="principalAmount"
            header="Principal Amount"
            body={(rowData) => amountTemplate(rowData.principalAmount)}
            sortable
          />

          <Column
            field="interestRate"
            header="Interest Rate"
            body={(rowData) => amountTemplate(rowData.interestRate)}
            sortable
          />

          <Column
            field="dailyInterest"
            header="Daily Interest"
            body={(rowData) => amountTemplate(rowData.dailyInterest)}
            sortable
          />

          <Column
            field="date"
            header="Date"
            body={(rowData) => formatDate(rowData.date)}
            sortable
          />

          <Column
            field="applicationId.invoiceAmount"
            header="Original Invoice Amount"
            body={(rowData) =>
              amountTemplate(rowData.applicationId.invoiceAmount)
            }
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
