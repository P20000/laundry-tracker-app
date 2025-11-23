# --- STAGE 1: Build the Application and Generate Client ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy ALL project root files needed for dependency installation
COPY package.json ./
COPY package-lock.json ./
COPY backend/package.json ./
COPY backend/package-lock.json ./
COPY backend/tsconfig.json ./

# Install dependencies (must be done in the backend context)
RUN npm install --prefix backend

# Build and generate Prisma client
COPY backend/prisma ./backend/prisma
COPY backend/src ./backend/src
RUN npm run build:ts --prefix backend
RUN npx prisma generate --schema=backend/prisma/schema.prisma

# --- STAGE 2: Final Production Runtime ---
FROM node:20-alpine AS final

WORKDIR /app/backend

# Copy only runtime essentials from the builder stage and source folders
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma/generated ./prisma/generated
COPY backend/prisma/migrations ./prisma/migrations
COPY backend/package.json ./

# Set the port
EXPOSE 3000

# FINAL START COMMAND (Run migrations, then start server)
CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/index.js"]