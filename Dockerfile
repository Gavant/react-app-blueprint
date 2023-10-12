FROM node:18.16.0-bookworm as environment
WORKDIR /app
ENV YARN_VERSION 4.0.0-rc.48

FROM environment as builder
COPY . .
RUN yarn policies set-version $YARN_VERSION
RUN yarn install
RUN mkdir /schema
RUN wget http://{{APP_NAME}}.s3.amazonaws.com/schema.graphql -P ./schema
RUN yarn codegen
RUN yarn build

FROM alpine as export
COPY --from=builder /app/dist /dist
RUN chmod -R 777 /dist
CMD ["cp", "-r", "/dist", "/output"]