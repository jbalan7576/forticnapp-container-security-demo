FROM node:22-alpine

WORKDIR /app

COPY app/package*.json ./
RUN npm ci --omit=dev

COPY app/ ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

LABEL org.opencontainers.image.title="FortiCNAPP GHCR Demo"
LABEL org.opencontainers.image.description="Containerized demo application scanned by FortiCNAPP before GHCR publication"
LABEL org.opencontainers.image.source="https://github.com/REPLACE_WITH_OWNER/REPLACE_WITH_REPO"

USER node

CMD ["node", "server.js"]
