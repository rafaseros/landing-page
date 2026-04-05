
# Stage 1: Build

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG PUBLIC_WEB3FORMS_KEY
ENV PUBLIC_WEB3FORMS_KEY=$PUBLIC_WEB3FORMS_KEY

RUN npm run build



# Stage 2: Serve

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

