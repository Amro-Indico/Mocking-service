FROM node:alpine3.10 AS builder
WORKDIR /app
COPY package.json yarn.lock ./ 
RUN yarn 
COPY . .
RUN npm run build


FROM node:alpine3.10
WORKDIR /app
COPY package.json yarn.lock ./ 
RUN yarn install --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]`