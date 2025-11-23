# --- STAGE 1: Build the React Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first for dependency caching
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Now copy rest of app source files
COPY . .

RUN npm run build

# --- STAGE 2: Serve with Nginx ---
FROM nginx:stable-alpine AS final

# Optional: set working directory explicitly
WORKDIR /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
