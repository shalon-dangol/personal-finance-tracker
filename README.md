# WalletWise — Personal Finance Tracker

A full-stack MERN expense tracker with JWT auth, category budgets, analytics dashboard, and transaction management.

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite, React Router v7, Tailwind CSS, axios, react-hot-toast
- **Backend:** Node 20, Express 4, Mongoose 8, JWT (access + refresh + httpOnly cookie), zod validation, helmet + rate-limit
- **Database:** MongoDB 7

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/shalon-dangol/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # set MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm install
npm run dev            # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev            # http://localhost:5173
```

## 🔐 Environment

See `backend/.env.example` and `frontend/.env.example` for all vars.

## 📡 API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/users/register | — | Register |
| POST | /api/users/login | — | Login (sets refresh cookie) |
| POST | /api/users/refresh | cookie | Refresh access token |
| POST | /api/users/logout | cookie | Logout |
| GET/POST | /api/categories | Bearer | List / create (scoped to user) |
| GET/PUT/DELETE | /api/categories/:id | Bearer | Read / update / delete own |
| GET/POST | /api/transactions?search=&category=&type=&dateFrom=&dateTo=&page=&limit= | Bearer | List with filters + pagination / create |
| GET/PUT/DELETE | /api/transactions/:id | Bearer | Read / update / delete own |
| GET | /api/analytics/summary | Bearer | Balance, totals, breakdown, recent |

All `transactions` / `categories` queries are scoped to `req.user` (fixed data-leak). `Transaction.category` is `ObjectId ref:Category`.

## 📌 Project Status

✅ **Core complete:** Auth (JWT refresh rotation), CRUD (user-scoped + validated via zod), dashboard analytics (single aggregation with $lookup — no N+1), filters (type + date range), toasts + skeletons. **Next:** tests, monthly trend chart, CSV export.

## 👤 Author

**Shalon Dangol** — [@shalon-dangol](https://github.com/shalon-dangol)
