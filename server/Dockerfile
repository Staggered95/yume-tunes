# 1. Grab a tiny Linux OS with Node 18 pre-installed
FROM node:18-alpine

# 2. Create a folder inside the container to hold our app
WORKDIR /app

# 3. Copy ONLY the package files first (Rule #1: Caching!)
COPY package*.json ./

# 4. Install the backend dependencies
#RUN npm install
RUN npm install --legacy-peer-deps

# 5. Copy the rest of the backend source code into the container
COPY . .

# 6. Expose the port your Express server listens on (change if yours isn't 5000)
EXPOSE 5000

# 7. The command to start the server
CMD ["npm", "start"]
