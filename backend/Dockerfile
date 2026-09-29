FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x /app/piper/piper 2>/dev/null || true

EXPOSE 5000

CMD ["npm", "start"]