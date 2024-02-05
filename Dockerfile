# Use an official Node.js runtime as a base image
FROM --platform=linux/amd64 node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy all files from the local backend directory to the working directory in the container
COPY ./ .
# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y nginx

RUN apt-get install -y certbot python3-certbot-nginx

COPY ./default /etc/nginx/sites-available/default

EXPOSE 80

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

CMD ["nginx -g 'daemon off;' & certbot --nginx -n --agree-tos --email mesadeayuda@yesbpo.co --redirect -d appcenteryes.com"]

# Specify the command to run your backend server
CMD ["npm", "start"]
