# --- STAGE 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Copy backend dependency files
# We copy them from the 'backend/' directory in the repo to 'backend/' in the container
COPY backend/package.json ./backend/
# Only copy package-lock if it exists (multi-stage builds make conditional copies tricky, 
# but we assume you have one in backend/. If not, npm install will generate one.)
COPY backend/package-lock.json ./backend/

# 2. Install dependencies
WORKDIR /usr/src/app/backend
RUN npm install

# 3. Copy source code (Backend + Shared)
WORKDIR /usr/src/app
COPY shared/ ./shared/
COPY backend/ ./backend/

# 4. Generate Prisma Client
WORKDIR /usr/src/app/backend
RUN npx prisma generate

# 5. Build TypeScript
# (rootDir is set to "../" in tsconfig, so this compiles backend and shared)
RUN npm run build:ts

# --- STAGE 2: Production Runner ---
FROM node:20-alpine AS runner

# Set working directory to backend
WORKDIR /usr/src/app/backend

# Copy necessary runtime files from builder stage
# We pull the fully built artifacts from the builder
COPY --from=builder /usr/src/app/backend/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/prisma ./prisma
COPY --from=builder /usr/src/app/backend/package.json ./

# Note: We REMOVED the 'COPY package.json ./' lines that were causing the error.
# The backend/package.json copied above is all we need.

# Set environment
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the app
CMD ["npm", "start"]