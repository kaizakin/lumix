FROM node:20-alpine
WORKDIR /app

COPY packages/db/prisma ./prisma
COPY packages/db/prisma.config.ts ./

RUN npm init -y \
  && npm install --no-audit prisma@7.3.0 dotenv@17.2.3

CMD ["npx", "prisma", "migrate", "deploy", "--schema=./prisma/schema.prisma"]
