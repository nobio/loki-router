FROM node:20-alpine
#FROM node:16

# Create app directory
WORKDIR /usr/src/app

# take the package.json only
COPY package.json ./

# install dependencies (but only those needed for production)
RUN npm install --omit=dev

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
