import { useEffect, useState, useMemo } from "react";
import { api } from "../utils/api";

export default function Transactions() {
  const [orders, setOrders] = useState([]);
  const [cardTypeFilter, setCardTypeFilter] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resendingId, setResendingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (cardTypeFilter) params.append("cardType", cardTypeFilter);
      const data = await api.getOrders(`?${params.toString()}`);
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardTypeFilter]);

  const handleResend = async (id) => {
    setResendingId(id);
    try {
      const result = await api.resendSms(id);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, smsSent: result.success, smsStatus: result.success ? "delivered" : "failed" } : o
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setResendingId(null);
    }
  };

  // Filter orders by phone number on the client side as the user types.
  // Strips spaces and dashes so "024 108 0856" or "+233241080856" both match "0241080856".
  const filteredOrders = useMemo(() => {
    if (!phoneSearch.trim()) return orders;
    const cleanSearch = phoneSearch.replace(/[\s-]/g, "").toLowerCase();
    return orders.filter((o) =>
      o.phone.replace(/[\s-]/g, "").toLowerCase().includes(cleanSearch)
    );
  }, [orders, phoneSearch]);

  return (
    <div>
      <div className="page-header">
        <h1>Transactions</h1>
        <p>Every purchase made through the USSD platform.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h2>Order history</h2>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by phone number..."
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            style={{ minWidth: "220px" }}
          />
          <select value={cardTypeFilter} onChange={(e) => setCardTypeFilter(e.target.value)}>
            <option value="">All types</option>
            <option value="BECE">BECE</option>
            <option value="WASSCE_SCHOOL">WASSCE School</option>
            <option value="WASSCE_PRIVATE">WASSCE Private</option>
          </select>
          {phoneSearch && (
            <button className="btn btn-secondary btn-sm" onClick={() => setPhoneSearch("")}>
              Clear search
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-text">Loading transactions...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>
              {phoneSearch
                ? `No transactions found for "${phoneSearch}".`
                : "No transactions yet. They will appear here once a customer buys a voucher."}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>PIN</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>SMS</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="mono">{order.phone}</td>
                    <td>{order.cardType.replace("_", " ")}</td>
                    <td className="mono">{order.pinCode}</td>
                    <td>GHS {order.amount}</td>
                    <td>
                      <span className={`badge badge-${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${order.smsSent ? "delivered" : "failed"}`}>
                        {order.smsSent ? "delivered" : "failed"}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      {!order.smsSent && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleResend(order._id)}
                          disabled={resendingId === order._id}
                        >
                          {resendingId === order._id ? "Sending..." : "Resend SMS"}
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