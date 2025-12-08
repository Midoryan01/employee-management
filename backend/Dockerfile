# backend/Dockerfile

# Gunakan Node.js versi ringan
FROM node:18

# Set folder kerja di dalam container
WORKDIR /app

# Copy file package.json dulu (biar cache efisien)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Generate Prisma Client (PENTING: Biar Prisma kenal database)
RUN npx prisma generate

# Buka port 5000
EXPOSE 5000

# Jalankan server
CMD ["npm", "start"]