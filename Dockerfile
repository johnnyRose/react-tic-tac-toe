FROM node:12.8.1-alpine AS builder
WORKDIR /build

COPY package.json /build
COPY yarn.lock /build

RUN yarn install

COPY . .
RUN yarn build


FROM node:12.8.1-alpine AS runner
WORKDIR /app

EXPOSE 5000
RUN npm install -g serve
COPY --from=builder /build/build .
CMD ["serve", "-s", "/app"]