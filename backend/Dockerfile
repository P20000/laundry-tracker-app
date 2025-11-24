# --- STAGE 1: Build the Application and Generate Client ---
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the backend's package files
# NOTE: Because Render's Docker context is the 'backend' folder, 
# paths MUST be relative to the 'backend' folder (i.e., NO 'backend/' prefix).
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Build and generate Prisma client
COPY prisma ./prisma
COPY src ./src
COPY shared ./../shared

# Generate the Prisma client based on the copied schema
RUN npx prisma generate --schema=prisma/schema.prisma

# Compile TypeScript to JavaScript
RUN npm run build:ts

# --- STAGE 2: Final Production Runtime ---
FROM node:20-alpine AS final

# Set the working directory in the final image
WORKDIR /app

# Copy only runtime essentials:
# 1. Production dependencies (node_modules)
COPY --from=builder /app/node_modules ./node_modules
# 2. Compiled JavaScript code (dist)
COPY --from=builder /app/dist ./dist
# 3. The generated Prisma client 
COPY --from=builder /app/prisma/generated ./prisma/generated
# 4. Migration files (required for migrate deploy)
COPY prisma/migrations ./prisma/migrations
# 5. Runtime configs
COPY package.json ./
COPY package-lock.json ./

# Set the port
EXPOSE 3000

# FINAL START COMMAND (Run migrations, then start server)
CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/index.js"]