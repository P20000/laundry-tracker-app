# --- STAGE 1: Build ---
FROM node:20-alpine AS builder

# Set the build context to the container's workspace root
WORKDIR /usr/src/app

# 1. Copy dependency files
COPY backend/package.json ./backend/
COPY backend/package-lock.json ./backend/

# 2. Install dependencies (Node dependencies are now installed before source code)
WORKDIR /usr/src/app/backend
RUN npm install

# 3. Copy source code (Backend + Shared)
WORKDIR /usr/src/app
COPY shared/ ./shared/
COPY backend/ ./backend/

# 4. Build TypeScript (This step now runs *after* all source code is present)
WORKDIR /usr/src/app/backend
RUN npm run build:ts

# --- STAGE 2: Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /usr/src/app/backend

# Copy necessary runtime files from builder stage
COPY --from=builder /usr/src/app/backend/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./

# Set environment
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]