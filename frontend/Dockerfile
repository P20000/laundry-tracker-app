# --- STAGE 1: Build the React Application ---
FROM node:20-alpine AS builder

# Set the working directory for the frontend application
WORKDIR /app

# Copy package.json files for dependency caching
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy all application files (React source, public assets)
COPY . .

# Run the production build command (outputs to 'build' folder by default)
RUN npm run build

# --- STAGE 2: Serve the Static Application with Nginx ---
FROM nginx:stable-alpine AS final

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config for client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the default web port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]