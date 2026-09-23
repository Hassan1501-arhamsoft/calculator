# Calculator

A full-stack scientific calculator: React (Vite) frontend + Node/Express
API backend, MongoDB-backed history. No login required — each browser
gets a random device id (stored in localStorage) so its history stays
private to it.

```
calculator/
├── backend/
│   ├── app.js                          Express app setup (middleware, routes)
│   ├── server.js                       Entry point — connects DB, starts listening
│   ├── uploads/                        Reserved for future file uploads
│   └── src/
│       ├── config/db.js                MongoDB connection
│       ├── controllers/                Request handlers
│       ├── middlewares/                deviceId, error handling, rate limiting
│       ├── models/                     Mongoose schemas
│       ├── routes/                     Route definitions
│       ├── services/                   Calculation logic (mathjs)
│       ├── socket/                     Reserved for future real-time features
│       └── utils/                      Shared helpers
├── frontend/
│   ├── index.html
│   ├── public/favicon.svg
│   └── src/
│       ├── api/axiosInstance.js        Shared axios client (device-id header)
│       ├── assets/                     Static assets
│       ├── components/                 Shared UI components (Loader, etc.)
│       ├── context/AppContext.jsx      App-wide context
│       ├── routes/                     AppRoutes + guard stubs (ready for future auth)
│       ├── features/calculator/
│       │   ├── components/             Display, Keypad, MatrixCalculator, UnitConverter, GraphPlotter, HistoryPanel
│       │   ├── context/                Feature-level context
│       │   ├── hooks/useCalculator.js
│       │   ├── pages/CalculatorPage.jsx
│       │   └── services/calculator.api.js
│       ├── App.jsx
│       └── main.jsx
└── package.json  Convenience scripts to run both together
```

## Prerequisites

- Node.js 18+
- A MongoDB database — either running locally, or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 1. Install

From the `calculator/` folder:

```bash
npm run install:all
```

(This runs `npm install` inside both `backend/` and `frontend/`. You can
also `cd` into each and run `npm install` separately.)

## 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/calculator   # or your Atlas connection string
CLIENT_URL=http://localhost:5173
```

`frontend/.env` already points at `http://localhost:5000/api` by default —
change `VITE_API_URL` if your backend runs elsewhere.

## 3. Run in development

From the `calculator/` root (runs both servers together):
```bash
npm run dev
```

Or run them separately, in two terminals:
```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
```

Open `http://localhost:5173`.

## 4. Production build

**Frontend** — builds a static bundle to `frontend/dist/`:
```bash
npm run build:frontend
```
Deploy `frontend/dist/` to any static host (Vercel, Netlify, S3+CloudFront,
Nginx, etc.), or serve it from the Express app by adding:
```js
app.use(express.static(path.join(__dirname, "../frontend/dist")));
```

**Backend** — runs directly on Node, no build step:
```bash
npm run start:backend
```
Deploy it anywhere that runs Node (Render, Railway, Fly.io, a VPS with
PM2, etc.), point `MONGO_URI` at your production database, and set
`CLIENT_URL` to your deployed frontend's origin (needed for CORS).

## About the routes/ guard stubs

`ProtectedRoute.jsx`, `PublicRoute.jsx`, and `AdminRoute.jsx` in
`frontend/src/routes/` currently just render their children — there's no
login system yet, so there's nothing to guard against. They're there,
named to match the convention, so that adding auth later is a matter of
filling them in rather than restructuring the app.

## What's included

| Mode | What it does |
|---|---|
| Basic / Scientific | +, −, ×, ÷, parentheses, sin/cos/tan, log/ln, powers, roots, π, e, factorial |
| Matrix | add, subtract, multiply, transpose, determinant, inverse — 2×2 to 4×4 |
| Convert | length, mass, temperature, area, volume, time, speed, data |
| Graph | plots `f(x)` over a chosen range on a canvas |
| History | last 100 calculations per browser, stored in MongoDB |

All math runs through `mathjs` on the backend (safe expression
evaluation — no `eval()`), so the frontend only builds strings and
renders results. The API also has basic production hardening baked in:
`helmet` for headers, `cors` locked to `CLIENT_URL`, request logging via
`morgan`, and rate limiting on the calculator routes.

## API reference

Base URL: `http://localhost:5000/api/calculator`

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/evaluate` | `{ expression }` | e.g. `"sin(45 deg) + 2^3"` |
| POST | `/matrix` | `{ operation, matrixA, matrixB? }` | `operation`: add / subtract / multiply / transpose / determinant / inverse |
| POST | `/convert` | `{ category, from, to, value }` | `category`: length / mass / temperature / area / volume / time / speed / data |
| POST | `/graph` | `{ expression, xMin, xMax, steps? }` | returns sampled `{x, y}` points |
| GET | `/history` | — | last 100 entries for this device |
| DELETE | `/history/:id` | — | remove one entry |
| DELETE | `/history` | — | clear all entries for this device |

Every request is scoped by the `x-device-id` header, which the frontend
sets automatically — you won't need to touch it unless you're testing
the API directly (e.g. with curl or Postman), in which case just send
any string as that header to get consistent history back.
