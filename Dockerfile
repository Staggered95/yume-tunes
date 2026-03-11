# ==========================================
# STAGE 1: Build the React App
# ==========================================
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy all frontend code (except what's in .dockerignore)
COPY . .

# Build the Vite project (outputs to the /dist folder)
RUN npm run build

# ==========================================
# STAGE 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

# Copy the built files from Stage 1 into Nginx's public HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Standard HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
