# 💒 Undanganku - Digital Wedding Invitation

Platform undangan pernikahan digital yang modern dan elegan. Dibuat dengan FastAPI (Backend) dan React (Frontend).

## 📋 Table of Contents

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup Development](#-setup-development)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Setup Backend](#2-setup-backend)
  - [3. Setup Frontend](#3-setup-frontend)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)

---

## ✨ Fitur

- 🎨 Desain undangan yang elegan dan responsif
- 👤 Sistem autentikasi (Register/Login)
- 📝 CRUD undangan pernikahan
- 👥 Manajemen daftar tamu
- 📱 Mobile-friendly
- 🔒 Secure dengan JWT authentication

---

## 🛠 Tech Stack

**Backend:**
- Python 3.10+
- FastAPI
- Motor (MongoDB Async Driver)
- PyJWT
- Uvicorn

**Frontend:**
- React
- Vite / Create React App
- TailwindCSS
- Axios
- React Router

**Database:**
- MongoDB Atlas (Cloud)

---

## 📦 Prerequisites

Pastikan sudah terinstall:

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** & npm - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign Up](https://www.mongodb.com/cloud/atlas)

---

## 🚀 Setup Development

### 1. Clone Repository

```bash
git clone https://github.com/umamumam/undanganku.git
cd undanganku
```

### 2. Setup Backend

#### 2.1. Masuk ke folder backend

```bash
cd backend
```

#### 2.2. Buat Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3. Upgrade pip (Optional)

```bash
python -m pip install --upgrade pip
```

#### 2.4. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.5. Buat file `.env`

Buat file `.env` di folder `backend/`:

```env
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/undanganku?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=undanganku
SECRET_KEY=your-secret-key-change-this-to-random-long-string-12345
```

**⚠️ Cara mendapatkan MONGO_URL:**

1. Login ke [MongoDB Atlas](https://cloud.mongodb.com/)
2. Pilih cluster Anda
3. Klik tombol **"Connect"**
4. Pilih **"Connect your application"**
5. Copy connection string
6. Ganti `<username>` dan `<password>` dengan kredensial database Anda
7. Tambahkan nama database `/undanganku` setelah `.net/`

**Generate SECRET_KEY yang aman:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### 2.6. Verifikasi Setup

```bash
python server.py
# Atau
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Jika berhasil, akan muncul:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx]
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ Backend siap di `http://localhost:8000`

---

### 3. Setup Frontend

#### 3.1. Buka terminal baru & masuk ke folder frontend

```bash
cd frontend
```

#### 3.2. Install Dependencies

```bash
npm install ajv@^8.12.0 --legacy-peer-deps
```

Atau jika ada error:

```bash
npm install --legacy-peer-deps
```

#### 3.3. Buat file `.env`

Buat file `.env` di folder `frontend/`:

**Untuk Development (Localhost):**
```env
VITE_API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8000
```

**Untuk Production (VPS/Deployment):**
```env
VITE_API_URL=https://api.yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

#### 3.4. Jalankan Frontend

```bash
npm start
# Atau untuk Vite:
npm run dev
```

✅ Frontend siap di `http://localhost:3000` atau `http://localhost:5173`

---

## 🎯 Menjalankan Aplikasi

### Setiap kali mau develop, buka 2 terminal:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Atau: npm run dev
```

### Akses Aplikasi:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc

---

## 🔐 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `DB_NAME` | Database name | `undanganku` |
| `SECRET_KEY` | JWT secret key (32+ chars) | `xjKmN9pQrStUvWxYz1234567890AbCdEf` |

### Frontend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL (Vite) | `http://localhost:8000` |
| `REACT_APP_API_URL` | Backend API URL (CRA) | `http://localhost:8000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL (Next.js) | `http://localhost:8000` |

---

## 📚 API Documentation

Setelah backend berjalan, akses dokumentasi API interaktif:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Main Endpoints:

```
POST   /api/auth/register     - Register user baru
POST   /api/auth/login        - Login user
GET    /api/invitations       - Get all invitations
POST   /api/invitations       - Create new invitation
GET    /api/invitations/{id}  - Get invitation by ID
PUT    /api/invitations/{id}  - Update invitation
DELETE /api/invitations/{id}  - Delete invitation
```

---

## 🐛 Troubleshooting

### Error: `KeyError: 'MONGO_URL'`

**Solusi:** Pastikan file `.env` sudah dibuat di folder `backend/` dengan isi yang benar.

---

### Error: `404 Not Found` di `/undefined/api/auth/register`

**Solusi:** 
1. Pastikan file `.env` ada di folder `frontend/`
2. Restart frontend server (`Ctrl+C` lalu `npm start` lagi)

---

### Error: `pip install` gagal

**Solusi:**
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

---

### Error: `npm install` dependency conflict

**Solusi:**
```bash
npm install --legacy-peer-deps
```

---

### Error: MongoDB Connection Failed

**Solusi:**
1. Cek koneksi internet
2. Pastikan IP Anda sudah di-whitelist di MongoDB Atlas:
   - Login MongoDB Atlas
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Cek username/password di connection string

---

### Port 8000 atau 3000 sudah dipakai

**Windows:**
```bash
# Cek process di port
netstat -ano | findstr :8000
# Kill process
taskkill /PID <PID_NUMBER> /F
```

**Linux/Mac:**
```bash
# Cek process di port
lsof -i :8000
# Kill process
kill -9 <PID_NUMBER>
```

---

## 🚢 Deployment

### Backend (VPS/Cloud)

1. **Setup Server** (Ubuntu)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv nginx supervisor -y
```

2. **Clone & Setup**
```bash
cd /var/www
git clone https://github.com/umamumam/undanganku.git
cd undanganku/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Setup Supervisor** (`/etc/supervisor/conf.d/undanganku.conf`)
```ini
[program:undanganku-backend]
command=/var/www/undanganku/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
directory=/var/www/undanganku/backend
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/undanganku-backend.err.log
stdout_logfile=/var/log/undanganku-backend.out.log
```

4. **Setup Nginx** (`/etc/nginx/sites-available/undanganku`)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

5. **SSL dengan Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Frontend (Vercel/Netlify/VPS)

1. **Build Production**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy ke Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

Atau upload folder `dist/` atau `build/` ke Netlify/VPS.

---

## 📝 Project Structure

```
undanganku/
├── backend/
│   ├── venv/                 # Virtual environment
│   ├── .env                  # Environment variables (JANGAN di-commit!)
│   ├── server.py             # FastAPI app
│   ├── requirements.txt      # Python dependencies
│   └── ...
├── frontend/
│   ├── node_modules/         # NPM packages
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Context (AuthContext, etc)
│   │   ├── pages/            # Page components
│   │   └── ...
│   ├── .env                  # Environment variables (JANGAN di-commit!)
│   ├── package.json          # NPM dependencies
│   └── ...
└── README.md                 # This file
```

---

## 🔒 Security Notes

- ⚠️ **JANGAN commit file `.env` ke Git!**
- ⚠️ Pastikan `.env` ada di `.gitignore`
- ⚠️ Generate `SECRET_KEY` yang kuat untuk production
- ⚠️ Whitelist IP di MongoDB Atlas untuk keamanan
- ⚠️ Gunakan HTTPS di production

---

## 👨‍💻 Development Tips

### Auto-reload saat develop:

**Backend:**
```bash
uvicorn server:app --reload
```
Code akan auto-reload saat ada perubahan.

**Frontend:**
```bash
npm start  # atau npm run dev
```
Browser akan auto-refresh saat ada perubahan.

---

## 📞 Support

Jika ada masalah atau pertanyaan:

1. Cek [Troubleshooting](#-troubleshooting) section
2. Buka issue di GitHub
3. Cek dokumentasi API di `/docs`

---

## 📄 License

MIT License - Feel free to use for your projects!

---

## 🙏 Credits

Created with ❤️ for your special day

---

**Happy Coding! 🚀**

---

### Quick Start Checklist:

- [ ] Clone repository
- [ ] Setup backend virtual environment
- [ ] Install backend dependencies
- [ ] Create backend `.env` with MongoDB credentials
- [ ] Run backend server
- [ ] Install frontend dependencies
- [ ] Create frontend `.env` with API URL
- [ ] Run frontend server
- [ ] Open browser di `http://localhost:3000`
- [ ] Test register & login

---

**Last Updated:** February 2026