# frontend/Dockerfile

# Tahap Build
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Install 'serve' untuk menjalankan hasil build React
RUN npm install -g serve

# Buka port 5173
EXPOSE 5173

# Jalankan aplikasi (flag -s untuk support SPA routing)
CMD ["serve", "-s", "dist", "-l", "5173"]