# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Copy the application code and build
COPY . .
RUN npm run build
RUN npm prune --production

# Runtime Stage
FROM node:22-alpine
WORKDIR /app

# Copy build artifacts and production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Expose port and set production environment
EXPOSE 3000
ENV NODE_ENV=production

# Start the app
CMD ["node", "build/index.js"]

