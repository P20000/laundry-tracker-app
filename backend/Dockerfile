# --- STAGE 1: Build (Using Debian Slim for glibc compatibility) ---
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY backend/package.json backend/package-lock.json ./backend/

WORKDIR /usr/src/app/backend
# Use BuildKit cache for faster npm installs
RUN --mount=type=cache,target=/root/.npm npm install

WORKDIR /usr/src/app
COPY shared/ ./shared/
COPY backend/ ./backend/

WORKDIR /usr/src/app/backend
RUN npm run build:ts

# --- STAGE 2: Production Dependencies ---
FROM node:20-slim AS prod-deps
WORKDIR /usr/src/app/backend
COPY backend/package.json backend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# --- STAGE 3: Production Runner ---
FROM node:20-slim AS runner
WORKDIR /usr/src/app/backend

# Copy only production dependencies
COPY --from=prod-deps /usr/src/app/backend/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]