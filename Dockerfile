# Use an official Node.js runtime as a base image
FROM --platform=linux/amd64 node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy all files from the local backend directory to the working directory in the container
COPY ./ .

# Install dependencies
RUN npm install

# Expose port for api.js
EXPOSE 3040
# Expose port for get.js
EXPOSE 8080
# Expose port for server.js
EXPOSE 3000
# Expose port for serverdos.js
EXPOSE 3001

# Specify the command to run your backend server
CMD ["npm", "start"]
