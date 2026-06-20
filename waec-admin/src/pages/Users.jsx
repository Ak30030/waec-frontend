import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Users() {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [creating, setCreating] = useState(false);

  const isSuperadmin = true; // For now, all admins are superadmins. Adjust this logic when implementing roles.

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperadmin) loadUsers();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);
    try {
      await api.registerAdmin({ name, email, password, role });
      setSuccess(`Admin account created for ${name}.`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("admin");
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this admin account? This cannot be undone.")) return;
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isSuperadmin) {
    return (
      <div>
        <div className="page-header">
          <h1>Admin Users</h1>
          <p>Manage who has access to this dashboard.</p>
        </div>
        <div className="empty-state">
          <p>Only a superadmin can view and manage admin accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Admin Users</h1>
        <p>Manage who has access to this dashboard.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="card">
        <div className="card-header">
          <h2>Add a new admin</h2>
        </div>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Full name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? "Creating..." : "Create admin"}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All admins</h2>
        </div>
        {loading ? (
          <div className="loading-text">Loading admins...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role === "superadmin" ? "delivered" : "pending"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u._id !== admin.id && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                          Remove
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
