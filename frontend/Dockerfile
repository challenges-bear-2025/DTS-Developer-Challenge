# frontend/Dockerfile

FROM node:20

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Build React app
RUN npm run build

# Install serve to serve the production build
RUN npm install -g serve

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]