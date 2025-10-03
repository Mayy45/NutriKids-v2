# NutriKids

Aplikasi web untuk monitoring nutrisi anak dengan teknologi AI. Membantu orang tua memantau asupan gizi dan mendapat rekomendasi nutrisi yang tepat.

## Teknologi

*Frontend:* Webpack, TensorFlow.js, SweetAlert2  
*Backend:* Hapi.js, Prisma, JWT Authentication

## Cara Menjalankan

### 1. Install Dependencies
bash
# Root project
npm install

# Backend
cd backend
npm install


### 2. Setup Backend
bash
cd backend

# Buat file .env baru
touch .env

# Generate Prisma
npm run prisma:generate

# Jalankan backend
npm run dev


### 3. Jalankan Frontend
bash
# Kembali ke root folder
cd ..

# Jalankan frontend
npm run start


## Environment Variables

Buat file .env baru di folder backend dan isi dengan:

env
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
EMAIL_USER="your-email"
EMAIL_PASS="your-password"


Ganti semua value sesuai konfigurasi Anda.

## Build Production

bash
# Backend
cd backend && npm run build

# Frontend  
npm run build


# Running ML
uvicorn app:app --host 0.0.0.0 --port 8000 -reload