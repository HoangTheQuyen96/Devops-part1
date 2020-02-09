FROM node:10.16.0-jessie

# Create app directory
WORKDIR /opt

# Environment variable configuration
ENV NODE_ENV=development \
    PORT=8000 \
    HOST=localhost 

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000

CMD ["node", "./src/app.js"]