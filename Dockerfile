FROM node:24-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "src/server.js"]
