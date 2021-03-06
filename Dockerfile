FROM node:12.22-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV REACT_APP_BACKEND_HOST 'http://ec2-3-140-210-235.us-east-2.compute.amazonaws.com/api'

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

EXPOSE 3000

RUN npm run build
RUN npm install -g serve

CMD ["serve", "-s", "build"]
