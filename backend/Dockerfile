# ── Stage: Production ────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifest first — leverage Docker layer cache
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
