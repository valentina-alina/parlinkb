# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18.16.0-alpine3.17

# Create and change to the app directory.
WORKDIR /usr/app

# Install app dependencies using the `npm ci` command.
# This command uses package-lock.json to install dependencies.
COPY package*.json ./
RUN npm install

# Install bcrypt explicitly
RUN npm install bcrypt
RUN npm install -D @types/bcrypt

# Copy the app files to the container.
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Install Prisma CLI for migrations
RUN npm install -g prisma

# Expose the port the app runs on
ENV SERVER_PORT 3000
EXPOSE $SERVER_PORT

# Start the app
CMD ["nodemon", "--watch", ".", "--exec", "npm", "run", "start:dev"]