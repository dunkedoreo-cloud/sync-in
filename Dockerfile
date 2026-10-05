# Production Multi-Stage Alpine Dockerfile for Sync-in
FROM node:20-alpine AS runner

# Create app directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy application files
COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY public/ ./public/

# Non-root user for container security
USER node

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start server
CMD ["node", "server.js"]
