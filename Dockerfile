FROM mhart/alpine-node:8.6.0


WORKDIR /src
ADD ./core .

ADD ./core/package.json src/package.json
RUN npm install

EXPOSE 8080
CMD ["npm", "run", "start:prod"]