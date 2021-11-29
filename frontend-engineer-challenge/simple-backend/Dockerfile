FROM node:16.13.0

ENV PORT 8080

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Copying source files
COPY . /usr/src/app

EXPOSE 8080

# Running the app
CMD "npm" "run" "start"
