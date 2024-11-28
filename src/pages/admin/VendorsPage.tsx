import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import NodataFound from "@components/NodataFound";
import { vendorsApi } from "@api/vendors.api";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
  status: "active" | "inactive" | "suspended";
}

function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    businessType: "",
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorsApi.getVendors();
      setVendors(response.data.data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load vendors",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingVendor) {
        await vendorsApi.updateVendor(editingVendor._id, formData);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Vendor updated successfully",
        });
      } else {
        await vendorsApi.createVendor(formData);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Vendor created successfully",
        });
      }
      setDialogVisible(false);
      loadVendors();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Operation failed",
      });
    }
  };

  const confirmDelete = (vendor: Vendor) => {
    confirmDialog({
      message: "Are you sure you want to delete this vendor?",
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleDelete(vendor._id),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await vendorsApi.deleteVendor(id);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Vendor deleted successfully",
      });
      loadVendors();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete vendor",
      });
    }
  };

  const actionBodyTemplate = (rowData: Vendor) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="info"
          onClick={() => {
            setEditingVendor(rowData);
            setFormData({
              name: rowData.name,
              email: rowData.email,
              phoneNumber: rowData.phoneNumber,
              businessName: rowData.businessName,
              businessType: rowData.businessType,
            });
            setDialogVisible(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => confirmDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex justify-content-between mb-4">
        <h1 className="text-xl font-bold">Vendors</h1>
        <Button
          label="Add Vendor"
          icon="pi pi-plus"
          onClick={() => {
            setEditingVendor(null);
            setFormData({
              name: "",
              email: "",
              phoneNumber: "",
              businessName: "",
              businessType: "",
            });
            setDialogVisible(true);
          }}
        />
      </div>

      <DataTable
        value={vendors}
        loading={loading}
        paginator
        rows={10}
        emptyMessage={<NodataFound message="No vendors found" />}
      >
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phoneNumber" header="Phone" />
        <Column field="businessName" header="Business Name" sortable />
        <Column field="businessType" header="Business Type" />
        <Column field="status" header="Status" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ width: "10rem" }}
        />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editingVendor ? "Edit Vendor" : "Add Vendor"}
        modal
        className="p-fluid"
        style={{ width: "50vw" }}
      >
        <div className="flex flex-column gap-4 mt-4">
          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone Number</label>
            <InputText
              id="phone"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
          </div>
          <div className="field">
            <label htmlFor="businessName">Business Name</label>
            <InputText
              id="businessName"
              value={formData.businessName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  businessName: e.target.value,
                }))
              }
            />
          </div>
          <div className="field">
            <label htmlFor="businessType">Business Type</label>
            <InputText
              id="businessType"
              value={formData.businessType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  businessType: e.target.value,
                }))
              }
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
          <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      </Dialog>
    </div>
  );
}

export default VendorsPage;
