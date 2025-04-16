# Use a lightweight and stable Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /home/node/app/Backend

# Ensure node_modules exists and set correct ownership
RUN mkdir -p node_modules && chown -R node:node /home/node/app

# Switch to the non-root node user
USER node

# Copy package.json and package-lock.json first (leverage Docker cache)
COPY Backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the backend files
COPY Backend/ ./

# Expose the port your app runs on
EXPOSE 3000

# Set the default command to run your server
CMD ["node", "/home/node/app/Backend/server.js"]
