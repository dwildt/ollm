# Simplified Docker build
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy all package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

# Install all dependencies (including devDependencies for concurrently)
RUN npm ci --ignore-scripts
WORKDIR /app/frontend
RUN npm ci --legacy-peer-deps
WORKDIR /app/backend  
RUN npm ci
WORKDIR /app

# Copy source code
COPY frontend/ ./frontend/
COPY backend/src ./backend/src

# Build both applications
RUN cd frontend && npm run build
RUN cd backend && npm run build

# Expose ports
EXPOSE 3000 3002

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Start both frontend and backend
CMD ["npm", "start"]