import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/pins", label: "Vouchers" },
  { to: "/transactions", label: "Transactions" },
  { to: "/users", label: "Admin Users" },
  { to: "/settings", label: "Settings" },
];

export default function Layout() {
  const { admin, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          WaecSell
          <span>Admin Panel</span>
        </div>

        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-chip">
            Signed in as
            <strong>{admin?.name || "Admin"}</strong>
          </div>
          <button className="btn-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
