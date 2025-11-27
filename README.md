<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# This will be the complete, comprehensive documentation for your Smart Wardrobe Tracker project. You can copy and paste this content directly into a file named README.md.

Smart Wardrobe Tracker

This is a secure, full-stack application designed for personal clothing inventory management, tracking wash cycles, and logging damaged items. The application follows modern architectural principles for stability and performance.

1. Project Overview

The application is built on a high-performance Monorepo architecture, leveraging Node.js containers deployed on Render for maximum efficiency and a generous free tier. User data is strictly separated using JWT authentication.

Core Architecture

Layer
Technology
Rationale
Frontend
React (MUI/M3)
Component-driven UI using Google's Material Design 3 for responsive and modern aesthetics.
Backend
Node.js / Express
Lightweight, fast API server written in TypeScript.
Database
Turso (LibSQL)
Serverless, edge-optimized database providing fast reads and generous free-tier storage.
Hosting/CI/CD
Render
Managed container hosting with automatic deployment via Dockerfiles.
Security
JWT \& Bcrypt
Token-based user authentication ensuring data privacy.

Data Flow Diagram

The backend relies on the correct configuration of the shared environment variables and segregated controllers.

2. Implemented Features

Feature
Description
Status
User Authentication
Secure Login and Registration using Bcrypt (password hashing) and JWT (token generation).
Complete
Data Separation
All data queries are filtered by userId (extracted from the JWT), ensuring privacy.
Complete
Item Creation
Add items with name, size, category, color, and image upload (stored as Base64 in DB).
Complete
Status Management
Dynamic status tracking: Queue Wash $\rightarrow$ Done Washing (resets wash date) $\rightarrow$ Report Damage $\rightarrow$ Mark Repaired.
Complete
Responsive UI
Material Design 3 (M3) interface with Navigation Rail (Desktop) and Bottom Bar (Mobile), and Dark Mode capability.
Complete
Debugging
Backend Admin Endpoints for system stats and logs.
Complete

3. Database Schema (Turso/LibSQL)

The database schema is defined using raw SQL for compatibility with Turso's SQLite engine.
SQL
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
color TEXT DEFAULT '\#000000',
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

4. Local Development Setup

4.1 Prerequisites

Node.js (LTS version 20+)
Turso CLI (npm install -g @turf/cli)
Git

4.2 Installation \& Dependencies

Run these commands from the respective directories:
Directory
Command
Purpose
laundry-tracker-app/
npm install
Install root workspace dependencies.
backend/
npm install
Install Node/Express/LibSQL dependencies.
frontend/
npm install
Install React/MUI dependencies.

4.3 Turso Configuration

You must configure your local and remote environments with your Turso credentials.
Environment Variable
Rationale
TURSO_DATABASE_URL
The URL of your remote Turso database (must start with https:// for Render stability).
TURSO_AUTH_TOKEN
The authentication token created for your Turso database.
JWT_SECRET
A long, secure random string (64+ chars) for signing authentication tokens.
Database Setup Commands:
Login:
Bash
turso auth login

Create DB (if necessary):
Bash
turso db create laundry-tracker-db

Get Token:
Bash
turso db tokens create laundry-tracker-db

Apply Schema (Crucial): Run the raw SQL from Section 3 in your Turso shell to create the tables.
Bash
turso db shell laundry-tracker-db

4.4 Running Locally

Open two separate terminal windows in the backend/ and frontend/ directories.
Terminal
Directory
Command
1 (Backend)
backend/
npm run dev (Starts server on localhost:3000)
2 (Frontend)
frontend/
npm start (Starts React app on a proxy port)

5. Deployment Guide (Render)

This application is deployed using the Docker environment setting on Render, bypassing the automatic buildpacks for maximum control.

5.1 Final Backend Dockerfile (backend/Dockerfile)

The final, stable Dockerfile is based on the node:20-slim image to ensure glibc compatibility for the LibSQL client, avoiding runtime errors.

5.2 Render Service Configuration Summary

When deploying the services on Render, ensure you set the correct root directory and environment variables.
Service Name
Source Folder
Environment
Required Variables
Backend API
laundry-tracker-app Root
Docker
TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, JWT_SECRET
Frontend Web
frontend/
Docker
API_BASE_URL (Set to the live URL of the Backend API)

5.3 Deployment Flow (Auth Sequence)

The authentication process relies on strict sequencing:
Frontend (Browser): User submits credentials to /signup.
Backend (/signup): Express handles the request.
Auth Controller: Generates randomUUID(), hashes the password (bcrypt), and inserts the new user into the Turso users table.
Auth Controller: Generates a JWT containing the new user's userId.
Backend ($\rightarrow$ Frontend): Returns the JWT token.
Frontend: Stores the token in localStorage and immediately starts fetchItems(), attaching the token as a Bearer header.
Auth Middleware: Verifies the JWT and injects req.userId.
Item Controller: Executes SELECT * FROM clothing_items WHERE userId = ?, ensuring data isolation.
Shutterstock
Explore

turn this into a nice readme.md file structure

Here is a polished, structured `README.md` file for your Smart Wardrobe Tracker project, incorporating your detailed documentation and best practices for clarity and professionalism.

***

# Smart Wardrobe Tracker

A secure, full-stack application for personal clothing inventory management, tracking wash cycles, and logging damaged items. Built with modern architectural principles for stability, performance, and ease of deployment.

***

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


***

## Implemented Features

| Feature | Description | Status |
| :-- | :-- | :-- |
| User Authentication | Secure Login and Registration using Bcrypt (password hashing) and JWT (token generation). | Complete |
| Data Separation | All data queries are filtered by userId (extracted from the JWT), ensuring privacy. | Complete |
| Item Creation | Add items with name, size, category, color, and image upload (stored as Base64 in DB). | Complete |
| Status Management | Dynamic status tracking: Queue Wash → Done Washing (resets wash date) → Report Damage → Mark Repaired. | Complete |
| Responsive UI | Material Design 3 (M3) interface with Navigation Rail (Desktop) and Bottom Bar (Mobile), and Dark Mode capability. | Complete |
| Debugging | Backend Admin Endpoints for system stats and logs. | Complete |


***

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


***

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


***

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

***

This structure provides a comprehensive, professional README.md that can be directly copied into your project for clear documentation and onboarding.
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

