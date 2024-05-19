FROM node:20-alpine
RUN mkdir -p /usr/src/worshipDB
WORKDIR /usr/src/worshipDB
COPY ./package.json /usr/src/worshipDB
RUN npm install && npm cache clean --force
COPY ./ /usr/src/worshipDB

ENV PORT 80
ENV NODE_ENV production
EXPOSE 80
ARG CLIENT_ID=${CLIENT_ID}
ARG CLIENT_SECRET=${CLIENT_SECRET}
ARG REDIRECT_URI=${REDIRECT_URI}
ARG SQLITE_FILE_ID=${SQLITE_FILE_ID}
ARG HOST=${HOST}
ARG PORT=${PORT}
ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
RUN npm run build
CMD ["node", "./dist/server/entry.mjs"]
