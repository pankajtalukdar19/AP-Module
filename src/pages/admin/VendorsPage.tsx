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
import { Dropdown } from "primereact/dropdown";

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
    status: "active",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    businessType: "",
    status: "",
  });

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Suspended", value: "suspended" },
  ];

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phoneNumber: "",
      businessName: "",
      businessType: "",
      status: "",
    };
    let isValid = true;

    // Name validation
    if (!formData?.name?.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!formData?.email?.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Phone validation
    if (!formData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Invalid phone number format";
      isValid = false;
    }

    // Business name validation
    if (!formData?.businessName?.trim()) {
      newErrors.businessName = "Business name is required";
      isValid = false;
    }

    // Business type validation
    if (!formData?.businessType?.trim()) {
      newErrors.businessType = "Business type is required";
      isValid = false;
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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
    if (!validateForm()) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please check the form for errors",
      });
      return;
    }

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
              status: rowData.status,
            });
            setErrors({
              name: "",
              email: "",
              phoneNumber: "",
              businessName: "",
              businessType: "",
              status: "",
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

  const statusBodyTemplate = (rowData: Vendor) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case "active":
          return "success";
        case "inactive":
          return "warning";
        case "suspended":
          return "danger";
        default:
          return null;
      }
    };

    return (
      <span
        className={`p-badge p-badge-${getSeverity(rowData.status)}`}
        style={{ textTransform: "capitalize" }}
      >
        {rowData.status}
      </span>
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
              status: "active",
            });
            setErrors({
              name: "",
              email: "",
              phoneNumber: "",
              businessName: "",
              businessType: "",
              status: "",
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
        <Column
          field="status"
          header="Status"
          sortable
          body={statusBodyTemplate}
        />
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
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={errors.name ? "p-invalid" : ""}
            />
            {errors.name && <small className="p-error">{errors.name}</small>}
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={formData.email}
              disabled={editingVendor ? true : false}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={errors.email ? "p-invalid" : ""}
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>
          <div className="field">
            <label htmlFor="phone">Phone Number</label>
            <InputText
              id="phone"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }));
                if (errors.phoneNumber)
                  setErrors((prev) => ({ ...prev, phoneNumber: "" }));
              }}
              className={errors.phoneNumber ? "p-invalid" : ""}
            />
            {errors.phoneNumber && (
              <small className="p-error">{errors.phoneNumber}</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="businessName">Business Name</label>
            <InputText
              id="businessName"
              value={formData.businessName}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  businessName: e.target.value,
                }));
                if (errors.businessName)
                  setErrors((prev) => ({ ...prev, businessName: "" }));
              }}
              className={errors.businessName ? "p-invalid" : ""}
            />
            {errors.businessName && (
              <small className="p-error">{errors.businessName}</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="businessType">Business Type</label>
            <InputText
              id="businessType"
              value={formData.businessType}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  businessType: e.target.value,
                }));
                if (errors.businessType)
                  setErrors((prev) => ({ ...prev, businessType: "" }));
              }}
              className={errors.businessType ? "p-invalid" : ""}
            />
            {errors.businessType && (
              <small className="p-error">{errors.businessType}</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              value={formData.status}
              options={statusOptions}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, status: e.value }));
                if (errors.status)
                  setErrors((prev) => ({ ...prev, status: "" }));
              }}
              className={errors.status ? "p-invalid" : ""}
              placeholder="Select Status"
            />
            {errors.status && (
              <small className="p-error">{errors.status}</small>
            )}
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
