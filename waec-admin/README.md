# WaecSell Admin Panel

React admin dashboard for managing the WaecSell USSD voucher platform — vouchers, transactions, admin users, and settings reference.

## Setup in VS Code

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL
cp .env.example .env
# Open .env and confirm VITE_API_URL points to your Render backend

# 3. Run locally
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

## Creating your first login

This admin panel logs in using the same `AdminUser` accounts from your backend. If you haven't created a superadmin yet, run the `seed.js` script described in your backend's README, or use mongosh:

```js
use waecdb
db.adminusers.insertOne({
  name: "Fred",
  email: "fred@yourdomain.com",
  password: "$2a$10$replace_with_bcrypt_hash", // see note below
  role: "superadmin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Note: the password must be a bcrypt hash, not plain text, since your backend's `AdminUser` model hashes on save via Mongoose middleware — inserting directly through mongosh skips that. The reliable way is to use the `seed.js` script from your backend instead, which goes through Mongoose and hashes correctly.

## Pages

| Page | What it does |
|---|---|
| Dashboard | Sales today/total, revenue, SMS failures, voucher stock by type |
| Vouchers | Bulk upload new vouchers (serial + PIN), filter and delete stock |
| Transactions | Full order history, filter by type, resend failed SMS |
| Admin Users | Superadmin-only — create and remove admin accounts |
| Settings | Reference list of environment variables controlling prices and SMS |

## Bulk voucher upload format

In the Vouchers page, paste one voucher per line as `serial,pincode`:

```
SN-100001,1234-5678-9012-3456
SN-100002,5678-9012-3456-7890
```

Select the voucher type from the dropdown before uploading — all lines in one upload go to the same type.

## Deploying to Vercel

1. Push this folder to its own GitHub repo
2. On vercel.com → New Project → import the repo
3. Add environment variable: `VITE_API_URL` = your Render backend URL
4. Deploy

## Connecting to your backend

This panel calls your existing Express routes directly:
- `/auth/login`, `/auth/me`, `/auth/register`
- `/admin/pins`, `/admin/pins/summary`, `/admin/pins/bulk`
- `/admin/orders`, `/admin/orders/stats`, `/admin/orders/:id/resend-sms`
- `/admin/users`

No backend changes are needed — this panel was built to match the routes already in your `waec-backend` project.
