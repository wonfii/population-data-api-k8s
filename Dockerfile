# Stage 1: Build Stage
FROM node:21-alpine AS build

# Create the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Production Stage
FROM node:21-alpine

# Create the working directory
WORKDIR /app

# Copy the built application from the first stage
COPY --from=build /app /app

# Expose the port the app will run on
EXPOSE 8000

# Command to run the application
CMD ["node", "app.js"]
