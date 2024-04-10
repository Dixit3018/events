# Use the official Node.js image as a base
FROM node:21.5.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Command to run your app
CMD ["node", "index.js"]
