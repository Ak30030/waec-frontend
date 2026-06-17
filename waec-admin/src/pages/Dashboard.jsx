import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pinSummary, setPinSummary] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [orderStats, pins] = await Promise.all([
          api.getOrderStats(),
          api.getPinsSummary(),
        ]);
        setStats(orderStats);
        setPinSummary(pins);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const availableByType = (type) =>
    pinSummary.find((p) => p._id.type === type && p._id.status === "available")?.count || 0;

  if (loading) return <div className="loading-text">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>An overview of sales, stock, and delivery health.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Sales today</div>
          <div className="value">{stats?.todaySales ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">Revenue today</div>
          <div className="value">GHS {stats?.todayRevenue ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total sales</div>
          <div className="value">{stats?.totalSales ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total revenue</div>
          <div className="value">GHS {stats?.totalRevenue ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">SMS failures</div>
          <div className={`value${stats?.smsFailures > 0 ? " danger" : ""}`}>
            {stats?.smsFailures ?? 0}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Voucher stock</h2>
        </div>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">BECE available</div>
            <div className="value">{availableByType("BECE")}</div>
          </div>
          <div className="stat-card">
            <div className="label">WASSCE School available</div>
            <div className="value">{availableByType("WASSCE_SCHOOL")}</div>
          </div>
          <div className="stat-card">
            <div className="label">WASSCE Private available</div>
            <div className="value">{availableByType("WASSCE_PRIVATE")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
