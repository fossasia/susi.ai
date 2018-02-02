FROM node:boron-alpine
MAINTAINER Mario Behling <mb@mariobehling.de>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy requirements
COPY package.json /usr/src/app/
COPY .eslintrc /usr/src/app/
COPY .angular-cli.json /usr/src/app/

# install requirements
RUN npm install -g @angular/cli@latest
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 4200

CMD [ "ng", "serve" ]

