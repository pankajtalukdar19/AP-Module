import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { userApi } from "@/api/user.api";
import { useAppSelector } from "@/hooks/reduxHook";

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    businessType: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<UserProfile>>({});
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordChange>>(
    {}
  );
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response: any = await userApi.getProfile(user?._id || "");
      setProfile(response.data.data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateProfile = () => {
    const newErrors: Partial<UserProfile> = {};

    if (!profile.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profile.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(profile.phoneNumber.trim())) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    if (!profile.businessName?.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!profile.businessType?.trim()) {
      newErrors.businessType = "Business type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Partial<PasswordChange> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfile()) return;

    try {
      setSaving(true);
      await userApi.updateProfile(user?._id || "", profile);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Profile updated successfully",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    try {
      setSaving(true);
      await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to change password",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />

      <Card title="Profile Information">
        <div className="flex flex-column gap-3">
          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={profile.name}
              onChange={(e) => {
                setProfile({ ...profile, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: "" });
                }
              }}
              className={errors.name ? "p-invalid" : ""}
            />
            {errors.name && <small className="p-error">{errors.name}</small>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={profile.email}
              disabled
              className="text-gray-500"
            />
            <small className="text-gray-500">
              Email cannot be changed. Please contact support if needed.
            </small>
          </div>

          <div className="field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <InputText
              id="phoneNumber"
              value={profile.phoneNumber}
              onChange={(e) => {
                setProfile({ ...profile, phoneNumber: e.target.value });
                if (errors.phoneNumber) {
                  setErrors({ ...errors, phoneNumber: "" });
                }
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
              value={profile.businessName}
              onChange={(e) => {
                setProfile({ ...profile, businessName: e.target.value });
                if (errors.businessName) {
                  setErrors({ ...errors, businessName: "" });
                }
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
              value={profile.businessType}
              onChange={(e) => {
                setProfile({ ...profile, businessType: e.target.value });
                if (errors.businessType) {
                  setErrors({ ...errors, businessType: "" });
                }
              }}
              className={errors.businessType ? "p-invalid" : ""}
            />
            {errors.businessType && (
              <small className="p-error">{errors.businessType}</small>
            )}
          </div>

          <Button
            label="Save Changes"
            onClick={handleUpdateProfile}
            loading={saving}
          />
        </div>
      </Card>

      <Card title="Change Password">
        <div className="flex flex-column gap-3">
          <div className="field">
            <label htmlFor="currentPassword">Current Password</label>
            <Password
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                });
                if (passwordErrors.currentPassword) {
                  setPasswordErrors({ ...passwordErrors, currentPassword: "" });
                }
              }}
              className={passwordErrors.currentPassword ? "p-invalid" : ""}
              feedback={false}
              toggleMask
            />
            {passwordErrors.currentPassword && (
              <small className="p-error">
                {passwordErrors.currentPassword}
              </small>
            )}
          </div>

          <div className="field">
            <label htmlFor="newPassword">New Password</label>
            <Password
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                });
                if (passwordErrors.newPassword) {
                  setPasswordErrors({ ...passwordErrors, newPassword: "" });
                }
              }}
              className={passwordErrors.newPassword ? "p-invalid" : ""}
            />
            {passwordErrors.newPassword && (
              <small className="p-error">{passwordErrors.newPassword}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <Password
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                });
                if (passwordErrors.confirmPassword) {
                  setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                }
              }}
              className={passwordErrors.confirmPassword ? "p-invalid" : ""}
              feedback={false}
              toggleMask
            />
            {passwordErrors.confirmPassword && (
              <small className="p-error">
                {passwordErrors.confirmPassword}
              </small>
            )}
          </div>

          <Button
            label="Change Password"
            onClick={handleChangePassword}
            loading={saving}
          />
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;
