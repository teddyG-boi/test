# Use the official Node.js image as the base image
FROM node:18-alpine

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

# Needed for the wait-for-db script and other utilities
RUN apk add --no-cache netcat-openbsd dos2unix openssl

# Set the working directory
WORKDIR /next

# Copy package files first
COPY package*.json ./

# Copy Prisma files
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Debug: Show prisma directory contents
RUN ls -la prisma/
RUN cat prisma/schema.prisma

# Generate Prisma client
RUN npx prisma generate

# Copy and prepare scripts
COPY wait-for-db.sh /usr/local/bin/wait-for-db.sh
COPY entrypoint.sh /
RUN chmod +x /usr/local/bin/wait-for-db.sh /entrypoint.sh && \
    dos2unix /entrypoint.sh /usr/local/bin/wait-for-db.sh

# Expose the port the app will run on
EXPOSE 3000

ENTRYPOINT ["sh", "/entrypoint.sh"]

# Start the application
CMD ["npm", "run", "dev"]
