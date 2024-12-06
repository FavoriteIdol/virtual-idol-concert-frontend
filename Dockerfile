# 1. Install dependencies only when needed
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./ # Copy package.json and lock file
RUN npm install --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production image to reduce the size
FROM node:18-alpine AS runner
WORKDIR /app

# Copy required files from the builder stage
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
