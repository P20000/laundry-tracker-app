# --- STAGE 1: Build the React Application ---
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app/frontend

# Copy package.json files for dependency caching
# This assumes the build context is the root of the repo (smart-wardrobe-repo)
COPY package.json ./
COPY frontend/package.json ./

# Install dependencies
RUN npm install

# Copy all application files (React source, public assets)
COPY frontend/ ./

# Run the production build command (outputs to 'build' folder by default)
RUN npm run build

# --- STAGE 2: Serve the Static Application with Nginx ---
FROM nginx:stable-alpine AS final

# Remove default Nginx config to replace it with one suitable for React Router
RUN rm /etc/nginx/conf.d/default.conf

# Copy a simple Nginx config that handles React's client-side routing
# (This file needs to be created next, e.g., in frontend/nginx.conf)
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static build output from the builder stage
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Expose the default web port
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]

