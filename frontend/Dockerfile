FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Command to run the application using the dynamic PORT provided by hosting services like Railway
CMD ["sh", "-c", "npm start -- -p ${PORT:-3000}"]
