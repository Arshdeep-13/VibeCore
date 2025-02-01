# backend/Dockerfile
# Use the Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

# Copy the rest of the application code
COPY . .
RUN npm install

# Expose the backend port
EXPOSE 8000

# Start the backend server
CMD ["npm", "run", "dev"]
