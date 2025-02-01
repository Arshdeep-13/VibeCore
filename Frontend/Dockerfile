# # Base image for Node.js
# FROM node:18 AS build

# # Set the working directory
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy all application files
# COPY . .

# # Build the application for production
# RUN npm run build

# # Nginx for serving static files in production
# FROM nginx:alpine AS production

# # Copy built files to Nginx directory
# COPY --from=build /app/dist /usr/share/nginx/html

# # Expose port for production
# EXPOSE 80

# # Start Nginx in production mode
# CMD ["nginx", "-g", "daemon off;"]

# Development image using Node.js
FROM node:18 AS development

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all application files
COPY . .

# Expose port for development
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
