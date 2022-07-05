FROM node:14-alpine
WORKDIR '/code'
ENV PORT 3001
COPY package.json .
##RUN npm install
COPY . .
## CMD ["npm", "start"]
## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

## Add your application to the docker image
ADD myserver.sh /myserver.sh

## Launch the wait tool and then your application
CMD /wait && /myserver.sh