import { useEffect, useState } from "react";
import { api } from "../utils/api";

const TYPES = ["BECE", "WASSCE_SCHOOL", "WASSCE_PRIVATE"];

export default function Pins() {
  const [pins, setPins] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bulkType, setBulkType] = useState("BECE");
  const [bulkText, setBulkText] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadPins = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.append("type", typeFilter);
      if (statusFilter) params.append("status", statusFilter);
      const data = await api.getPins(`?${params.toString()}`);
      setPins(data.pins || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter]);

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Expected format per line: serial,pinCode
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setError("Paste at least one voucher line in the format: serial,pincode");
      return;
    }

    const pinsToUpload = lines.map((line) => {
      const [serial, code] = line.split(",").map((s) => s.trim());
      return { serial, code, type: bulkType };
    });

    const invalid = pinsToUpload.find((p) => !p.serial || !p.code);
    if (invalid) {
      setError("Each line must be in the format: serial,pincode — check your input.");
      return;
    }

    setUploading(true);
    try {
      const result = await api.uploadPins(pinsToUpload);
      setSuccess(`Uploaded ${result.inserted} voucher(s) successfully.`);
      setBulkText("");
      loadPins();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this voucher? This cannot be undone.")) return;
    try {
      await api.deletePin(id);
      setPins((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Vouchers</h1>
        <p>Upload new stock and review every voucher in the system.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="card">
        <div className="card-header">
          <h2>Upload vouchers in bulk</h2>
        </div>
        <form onSubmit={handleBulkUpload}>
          <div className="form-group">
            <label>Voucher type</label>
            <select
              className="form-control"
              value={bulkType}
              onChange={(e) => setBulkType(e.target.value)}
            >
              <option value="BECE">BECE</option>
              <option value="WASSCE_SCHOOL">WASSCE School</option>
              <option value="WASSCE_PRIVATE">WASSCE Private</option>
            </select>
          </div>
          <div className="form-group">
            <label>Vouchers — one per line, format: serial,pincode</label>
            <textarea
              className="form-control"
              placeholder={"SN-100001,1234-5678-9012-3456\nSN-100002,5678-9012-3456-7890"}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload vouchers"}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All vouchers</h2>
        </div>

        <div className="filter-bar">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-text">Loading vouchers...</div>
        ) : pins.length === 0 ? (
          <div className="empty-state">
            <p>No vouchers match these filters yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Serial</th>
                  <th>PIN</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Sold to</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pins.map((pin) => (
                  <tr key={pin._id}>
                    <td className="mono">{pin.serial || "—"}</td>
                    <td className="mono">{pin.code}</td>
                    <td>{pin.type.replace("_", " ")}</td>
                    <td>
                      <span className={`badge badge-${pin.status}`}>{pin.status}</span>
                    </td>
                    <td className="mono">{pin.soldTo || "—"}</td>
                    <td>
                      {pin.status === "available" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(pin._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
