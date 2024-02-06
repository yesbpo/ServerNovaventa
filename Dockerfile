# Use an official Node.js runtime as a base image
FROM --platform=linux/amd64 node:14

# Set the working directory in the container
WORKDIR /usr/src/app
# Copy all files from the local backend directory to the working directory in the container
COPY ./ .
# Install dependencies
RUN npm install
RUN apt install nginx
COPY ./default /etc/nginx/sites-available
# Copy SSL certificate and key
COPY ./certificado.crt /etc/nginx
COPY ./clave.key /etc/nginx

# Expose port for api.js
EXPOSE 3040
# Expose port for get.js
EXPOSE 8080
# Expose port for server.js
EXPOSE 3000
# Expose port for serverdos.js
EXPOSE 3001
# Expose port for serversocket.js
EXPOSE 3050
# Expose port 443 for HTTPS
EXPOSE 443  

CMD ["sudo", "systemctl", "start", "nginx"]
# Specify the command to run your backend server
CMD ["npm", "start"]
