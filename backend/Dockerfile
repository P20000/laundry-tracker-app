# --- STAGE 1: Dependency and Source Copy ---
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app/backend

# Copy package.json files for dependency caching
COPY package.json /app/
COPY backend/package.json ./

# Install only production dependencies (devDeps are heavy and not needed at runtime)
# We install in the builder stage to ensure package caching is efficient
RUN npm install --only=production

# Copy application source code
COPY backend/src ./src

# --- STAGE 2: Final Production Runtime ---
# Use a lightweight node image for the final runtime environment
FROM node:20-alpine AS final

# Set the working directory in the final image
WORKDIR /app/backend

# Copy only the necessary files and dependencies from the builder stage
# 1. Production dependencies (node_modules)
COPY --from=builder /app/backend/node_modules ./node_modules
# 2. Application source code and database migrations/config
COPY backend/src ./src
COPY backend/database ./database
COPY backend/package.json ./

# Set the port and environment variables
ENV PORT=3000
EXPOSE 3000

# Command to start the application (update this to your actual entry point)
CMD ["node", "./src/index.js"]