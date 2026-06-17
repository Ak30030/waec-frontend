export default function Settings() {
  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configuration for prices and messaging currently lives in your backend's environment variables.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Voucher prices</h2>
        </div>
        <p style={{ color: "var(--color-text-dim)", fontSize: "13.5px", marginBottom: "16px" }}>
          Prices are set on Render under your backend's Environment tab. Update these values
          there and redeploy for changes to take effect:
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">BECE_PRICE</td>
                <td>Price per BECE voucher (GHS)</td>
              </tr>
              <tr>
                <td className="mono">WASSCE_SCHOOL_PRICE</td>
                <td>Price per WASSCE School voucher (GHS)</td>
              </tr>
              <tr>
                <td className="mono">WASSCE_PRIVATE_PRICE</td>
                <td>Price per WASSCE Private voucher (GHS)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>SMS &amp; USSD provider</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">AT_USERNAME</td>
                <td>Africa's Talking username — "sandbox" for testing, your live username when launched</td>
              </tr>
              <tr>
                <td className="mono">AT_API_KEY</td>
                <td>Africa's Talking API key matching the username above</td>
              </tr>
              <tr>
                <td className="mono">AT_SENDER_ID</td>
                <td>Registered sender name customers see on SMS (live only)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
