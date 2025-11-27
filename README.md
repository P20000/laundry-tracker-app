# Smart Wardrobe Tracker

A secure, full-stack application for personal clothing inventory management, tracking wash cycles, and logging damaged items. Built with modern architectural principles for stability, performance, and ease of deployment.



## Project Overview

This application is built on a high-performance Monorepo architecture, leveraging Node.js containers deployed on Render for maximum efficiency and a generous free tier. User data is strictly separated using JWT authentication to ensure privacy and security.[^3]

### Core Architecture

| Layer | Technology | Rationale |
| :-- | :-- | :-- |
| Frontend | React (MUI/M3) | Component-driven UI using Google's Material Design 3 for responsive and modern aesthetics. |
| Backend | Node.js / Express | Lightweight, fast API server written in TypeScript. |
| Database | Turso (LibSQL) | Serverless, edge-optimized database providing fast reads and generous free-tier storage[^2][^4]. |
| Hosting/CI/CD | Render | Managed container hosting with automatic deployment via Dockerfiles. |
| Security | JWT \& Bcrypt | Token-based user authentication ensuring data privacy. |




## Implemented Features

| Feature | Description | Status |
| :-- | :-- | :-- |
| User Authentication | Secure Login and Registration using Bcrypt (password hashing) and JWT (token generation). | Complete |
| Data Separation | All data queries are filtered by userId (extracted from the JWT), ensuring privacy. | Complete |
| Item Creation | Add items with name, size, category, color, and image upload (stored as Base64 in DB). | Complete |
| Status Management | Dynamic status tracking: Queue Wash → Done Washing (resets wash date) → Report Damage → Mark Repaired. | Complete |
| Responsive UI | Material Design 3 (M3) interface with Navigation Rail (Desktop) and Bottom Bar (Mobile), and Dark Mode capability. | Complete |
| Debugging | Backend Admin Endpoints for system stats and logs. | Complete |




## Database Schema (Turso/LibSQL)

The database schema is defined using raw SQL for compatibility with Turso's SQLite engine.

```sql
-- 1. USERS TABLE (Stores hashed credentials)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. CLOTHING ITEMS TABLE (Main Inventory - Linked to User)
CREATE TABLE IF NOT EXISTS clothing_items (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    itemType TEXT NOT NULL,
    category TEXT DEFAULT 'Casuals',
    size TEXT DEFAULT 'M',
    color TEXT DEFAULT '#000000',
    imageUrl TEXT,
    currentStatus TEXT DEFAULT 'CLEAN' NOT NULL,
    damageLog TEXT,
    lastWashed DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. WASH HISTORY TABLE
CREATE TABLE IF NOT EXISTS wash_events (
    id TEXT PRIMARY KEY,
    clothingItemId TEXT NOT NULL,
    washDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(clothingItemId) REFERENCES clothing_items(id) ON DELETE CASCADE
);

-- Add Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_clothing_items_user ON clothing_items(userId);
```




## Local Development Setup

### Prerequisites

- Node.js (LTS version 20+)
- Turso CLI (`npm install -g @turf/cli`)
- Git


### Installation \& Dependencies

Run these commands from the respective directories:


| Directory | Command | Purpose |
| :-- | :-- | :-- |
| `laundry-tracker-app/` | `npm install` | Install root workspace dependencies. |
| `backend/` | `npm install` | Install Node/Express/LibSQL dependencies. |
| `frontend/` | `npm install` | Install React/MUI dependencies. |

### Turso Configuration

Configure your local and remote environments with your Turso credentials:


| Environment Variable | Rationale |
| :-- | :-- |
| `TURSO_DATABASE_URL` | The URL of your remote Turso database (must start with https:// for Render stability). |
| `TURSO_AUTH_TOKEN` | The authentication token created for your Turso database. |
| `JWT_SECRET` | A long, secure random string (64+ chars) for signing authentication tokens. |

**Database Setup Commands:**

```bash
turso auth login
turso db create laundry-tracker-db
turso db tokens create laundry-tracker-db
turso db shell laundry-tracker-db
```

Apply the raw SQL from the Database Schema section in your Turso shell to create the tables.

### Running Locally

Open two separate terminal windows:


| Terminal | Directory | Command |
| :-- | :-- | :-- |
| 1 | `backend/` | `npm run dev` |
| 2 | `frontend/` | `npm start` |




## Deployment Guide (Render)

This application is deployed using the Docker environment setting on Render, bypassing the automatic buildpacks for maximum control.

### Final Backend Dockerfile

```dockerfile
# Use node:20-slim for glibc compatibility with LibSQL client
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
```


### Render Service Configuration Summary

| Service Name | Source Folder | Environment | Required Variables |
| :-- | :-- | :-- | :-- |
| Backend API | `laundry-tracker-app` Root | Docker | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET` |
| Frontend Web | `frontend/` | Docker | `API_BASE_URL` (Set to the live URL of the Backend API) |

### Deployment Flow (Auth Sequence)

1. Frontend (Browser): User submits credentials to `/signup`.
2. Backend (`/signup`): Express handles the request.
3. Auth Controller: Generates `randomUUID()`, hashes the password (bcrypt), and inserts the new user into the Turso users table.
4. Auth Controller: Generates a JWT containing the new user's `userId`.
5. Backend → Frontend: Returns the JWT token.
6. Frontend: Stores the token in localStorage and immediately starts `fetchItems()`, attaching the token as a Bearer header.
7. Auth Middleware: Verifies the JWT and injects `req.userId`.
8. Item Controller: Executes `SELECT * FROM clothing_items WHERE userId = ?`, ensuring data isolation.




