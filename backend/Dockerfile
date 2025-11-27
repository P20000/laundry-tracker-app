# --- STAGE 1: Build (Using Debian Slim for glibc compatibility) ---
FROM node:20.10.0-slim AS builder

# Set the build context to the container's workspace root
WORKDIR /usr/src/app

# 1. Copy backend dependency files
COPY backend/package.json ./backend/
COPY backend/package-lock.json ./backend/

# 2. Install dependencies 
WORKDIR /usr/src/app/backend
RUN npm install

# 3. Copy source code (Backend + Shared)
WORKDIR /usr/src/app
COPY shared/ ./shared/
COPY backend/ ./backend/

# 4. Build TypeScript 
WORKDIR /usr/src/app/backend
RUN npm run build:ts

# --- STAGE 2: Production Runner (Using Debian Slim Runtime) ---
FROM node:20.10.0-slim AS runner

# Create non-root user for security
RUN useradd -m -u 1000 appuser

# Set working directory to backend
WORKDIR /usr/src/app/backend

# Copy necessary runtime files from builder stage
COPY --from=builder /usr/src/app/backend/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./

# Set environment
ENV PORT=3000
ENV NODE_ENV=production

# Change ownership to non-root user
RUN chown -R appuser:appuser /usr/src/app/backend

# Switch to non-root user
USER appuser

EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the app
CMD ["npm", "start"]