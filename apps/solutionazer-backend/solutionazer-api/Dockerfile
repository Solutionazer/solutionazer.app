# Node.js version (LTS)
FROM node:22.15.0-slim

# Set work directory
WORKDIR /usr/src/app

# Copy 'package.json' and 'package-lock.json'
COPY package*.json ./

# Install dependencies
RUN npm install -g @nestjs/cli && npm install --omit=dev --verbose

# Copy the rest of the code
COPY . .

# Build NestJS
RUN npm run build

# Expose port
EXPOSE 3001

# Command to boot
CMD ["NODE-ENV=production", "npm", "run", "start:prod"]

