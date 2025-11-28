# --- STAGE 1: Dependency Cache Layer ---
FROM node:20-slim AS deps
WORKDIR /app
# 1. Copy ONLY package files
COPY package.json ./
COPY package-lock.json ./
# 2. Install dependencies (This layer is cached heavily)
RUN npm ci

# --- STAGE 2: Builder (Production Build) ---
FROM node:20-slim AS builder
WORKDIR /app

# 3. Copy installed dependencies from the cached layer (FAST)
COPY --from=deps /app/node_modules ./node_modules
# 4. Copy package files (needed for react-scripts to run)
COPY package.json ./
COPY package-lock.json ./

# 5. Copy SOURCE CODE (This is the layer that changes frequently and invalidates cache)
COPY src ./src
COPY public ./public

# 6. Run the build (Outputs to /app/build)
RUN npm run build

# --- STAGE 3: Final (Nginx Runner) ---
FROM nginx:stable-alpine AS final

# Set default config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from the builder stage (FAST)
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]