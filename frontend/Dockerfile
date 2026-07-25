# --- STAGE 1: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# Accept optional API base URL override (used for local docker-compose testing)
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

COPY package.json package-lock.json ./
# Use BuildKit cache for faster npm installs
RUN --mount=type=cache,target=/root/.npm npm install

COPY src ./src
COPY public ./public

RUN npm run build

# --- STAGE 2: Final (Nginx Runner) ---
FROM nginx:alpine-slim AS final

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]