# ── Stage 1: Build React app ─────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first — cache layer
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/src ./src
COPY frontend/index.html frontend/vite.config.js ./
RUN npm run build

# ── Stage 2: Serve with nginx ─────────────────────────────────────────────────
FROM nginx:alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx reverse-proxy config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
