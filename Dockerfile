FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy requirements
COPY package.json /usr/src/app/

# install requirements
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "run" , "docker-start" ]

