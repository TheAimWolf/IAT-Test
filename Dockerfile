# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY . .

# Build the app for production
RUN npm run build

# Expose port 5000 for the app to be served on
EXPOSE 5000

# Define the command to run the app
CMD [ "npm", "start" ]