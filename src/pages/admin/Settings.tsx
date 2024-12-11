import { useState, useEffect, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { settingsApi } from "@api/settings.api";
import { Password } from "primereact/password";

interface Settings {
  interestRate: number;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM: string;
  SMTP_TO: string;
}

function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getSettings();
      setSettings(response.data.data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: Partial<Settings>) => {
    try {
      setSaving(true);
      await settingsApi.updateSettings(data);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Settings updated successfully",
      });
      loadSettings();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update settings",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card">
      <Toast ref={toast} />
      <h1 className="text-xl font-bold mb-4">System Settings</h1>

      <TabView>
        <TabPanel header="Interest Rate">
          <div className="flex flex-column gap-3">
            <div className="field">
              <label htmlFor="interestRate">Interest Rate (%)</label>
              <InputNumber
                id="interestRate"
                 className="ml-2"
                value={settings.interestRate * 100}
                onValueChange={(e) => {
                  if (e.value !== null && e.value !== undefined) {
                    handleUpdate({ interestRate: e.value / 100 });
                  }
                }}
                mode="decimal"
                minFractionDigits={2}
                maxFractionDigits={4}
                min={0}
                max={100}
              />
              <small className="text-gray-500">
                Current rate: {(settings.interestRate * 100).toFixed(2)}%
              </small>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Email Settings">
          <div className="flex flex-column gap-3">
            <div className="field">
              <label htmlFor="smtpHost">SMTP Host </label>
              <InputText
                id="smtpHost"
                className="ml-2"
                value={settings.SMTP_HOST}
                onChange={(e) => handleUpdate({ SMTP_HOST: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="smtpPort">SMTP Port</label>
              <InputNumber
                id="smtpPort"
                 className="ml-2"
                value={settings.SMTP_PORT}
                onValueChange={(e) => {
                  if (e.value !== null) {
                    handleUpdate({ SMTP_PORT: e.value });
                  }
                }}
                min={1}
                max={65535}
              />
            </div>

            <div className="field">
              <label htmlFor="smtpUser">SMTP User</label>
              <InputText
                id="smtpUser"
                 className="ml-2"
                value={settings.SMTP_USER}
                onChange={(e) => handleUpdate({ SMTP_USER: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="smtpPassword">SMTP Password</label>
              <Password
                id="smtpPassword"
                 className="ml-2"
                value={settings.SMTP_PASSWORD}
                onChange={(e) =>
                  handleUpdate({ SMTP_PASSWORD: e.target.value })
                }
                toggleMask
                feedback={false}
              />
            </div>

            <div className="field">
              <label htmlFor="smtpFrom">From Email</label>
              <InputText
                id="smtpFrom"
                 className="ml-2"
                value={settings.SMTP_FROM}
                onChange={(e) => handleUpdate({ SMTP_FROM: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="smtpTo">To Email</label>
              <InputText
                id="smtpTo"
                 className="ml-2"
                value={settings.SMTP_TO}
                onChange={(e) => handleUpdate({ SMTP_TO: e.target.value })}
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
}

export default Settings;
