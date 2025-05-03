# Node.js version (LTS)
FROM node:22.15.0-slim

# Set work directory
WORKDIR /app

# Copy 'package.json' and 'package-lock.json'
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the code
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Command to boot
CMD ["npm", "run", "start"]
