import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { admin } = useAuth();
  const isSuperadmin = admin?.role === "superadmin";

  const [form, setForm] = useState({
    BECE: "",
    WASSCE_SCHOOL: "",
    WASSCE_PRIVATE: "",
    bulkContactNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .getSettings()
      .then((data) =>
        setForm({
          BECE: data.BECE,
          WASSCE_SCHOOL: data.WASSCE_SCHOOL,
          WASSCE_PRIVATE: data.WASSCE_PRIVATE,
          bulkContactNumber: data.bulkContactNumber || "",
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.updateSettings({
        BECE: Number(form.BECE),
        WASSCE_SCHOOL: Number(form.WASSCE_SCHOOL),
        WASSCE_PRIVATE: Number(form.WASSCE_PRIVATE),
        bulkContactNumber: form.bulkContactNumber,
      });
      setSuccess("Prices updated. Changes apply immediately on the USSD platform.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-text">Loading settings...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Update voucher prices and contact details shown to customers on USSD.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="card">
        <div className="card-header">
          <h2>Voucher prices (GHS)</h2>
        </div>

        {!isSuperadmin && (
          <p style={{ color: "var(--color-text-dim)", fontSize: "13px", marginBottom: "16px" }}>
            Only a superadmin can change prices. You can view the current values below.
          </p>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>BECE Checker price</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="form-control"
              value={form.BECE}
              onChange={(e) => handleChange("BECE", e.target.value)}
              disabled={!isSuperadmin}
              required
            />
          </div>

          <div className="form-group">
            <label>WASSCE School Candidate price</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="form-control"
              value={form.WASSCE_SCHOOL}
              onChange={(e) => handleChange("WASSCE_SCHOOL", e.target.value)}
              disabled={!isSuperadmin}
              required
            />
          </div>

          <div className="form-group">
            <label>WASSCE Private Candidate price</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="form-control"
              value={form.WASSCE_PRIVATE}
              onChange={(e) => handleChange("WASSCE_PRIVATE", e.target.value)}
              disabled={!isSuperadmin}
              required
            />
          </div>

          <div className="form-group">
            <label>Bulk purchase contact number</label>
            <input
              type="text"
              className="form-control"
              value={form.bulkContactNumber}
              onChange={(e) => handleChange("bulkContactNumber", e.target.value)}
              disabled={!isSuperadmin}
              placeholder="0244131805"
            />
          </div>

          {isSuperadmin && (
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}