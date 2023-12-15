FROM node:20 as builder

WORKDIR "/app"

COPY . .

RUN npm ci

RUN npm run build

RUN npm prune --production

FROM node:20 AS production

WORKDIR "/app"

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

COPY --from=builder /app/prisma ./prisma

CMD [ "npm", "run", "start:migrate:prod"]

# ENV PORT=3000;

# EXPOSE 3000 

# RUN mkdir -p ${APP_DIR}
# WORKDIR ${APP_DIR}

# COPY package*.json ./


# RUN npm install -g @nestjs/cli
# RUN npm install

# COPY . .

# RUN npm run start