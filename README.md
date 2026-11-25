# Yardd — Smart Freight & Yard Logistics Management Platform 🚛📦

**Yardd** is a full-stack logistics and yard management system engineered to streamline freight staging, dock scheduling, container tracking, and land/parcel asset allocation. Built with a modern **Next.js (Turbopack)** frontend, an **Express.js** backend, and containerized **PostgreSQL** storage with full audit logging.

---

## 🚀 System Highlights

- **Dynamic Yard Asset Management:** Monitor and allocate physical yard space, staging parcels, and warehouse docking zones.
- **Transaction & Freight Ledger:** Immutable tracking of inbound and outbound freight transactions with audit logs.
- **Role-Based Access Control:** Differentiated access levels for yard marshals, logistics managers, and drivers.
- **Dockerized Infrastructure:** Ready-to-deploy PostgreSQL instance preconfigured with connection pooling and volume persistence.
- **Modern Responsive Dashboard:** Fast Turbopack-powered Next.js interface with real-time operational status.

---

## 🏗 Architecture & Tech Stack

```
yardd/
├── frontend/                 # Next.js 16 Client (Turbopack + Tailwind)
│   ├── src/app/              # App Router Pages & Layouts
│   ├── tsconfig.json         # Strict TypeScript configuration
│   └── package.json
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database pool & connection
│   │   ├── models/           # Land, User, Transaction, AuditLog models
│   │   └── app.js            # Express application bootstrap
│   └── package.json
└── docker-compose.yml        # PostgreSQL alpine container service
```

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Turbopack
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Database:** PostgreSQL 15 (Alpine) via Docker
- **Containerization:** Docker Compose

---

## 🛠 Quick Start

### 1. Start the Database (Docker)
```bash
docker-compose up -d
```
This spins up PostgreSQL on `localhost:5432` with database `yardd_db`.

---

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run the backend server
node src/app.js
```
The API server will listen on `http://localhost:5000`.

---

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Open `http://localhost:3000` to access the Yardd dashboard.

---

## 🗄 Data Models

- **User:** Authentication and operational role management (Yard Manager, Gate Security, Carrier).
- **Land / Yard Plot:** Spatial dimensions, occupancy state, load rating, and assignment metadata.
- **Transaction:** Real-time movement logs, container IDs, timestamping, and authorization receipts.
- **AuditLog:** Historical change logs tracking system operations for compliance and security auditing.

---

## 📄 License
Licensed under the [MIT License](LICENSE).
