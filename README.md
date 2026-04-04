# 🎓 Student Profile App

Ứng dụng web fullstack — React + Node.js + MongoDB + Docker

## 📁 Cấu trúc project

```
student-app/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json
│   ├── .env               # Environment variables
│   └── Dockerfile         # Backend Docker image
├── frontend/
│   ├── src/
│   │   ├── api/index.js   # API client layer
│   │   ├── components/
│   │   │   ├── AboutPage.jsx   # GET + POST /about
│   │   │   └── HealthPage.jsx  # GET /health
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile         # Multi-stage: Node build → nginx serve
├── nginx/
│   └── default.conf       # Reverse proxy: /api → backend:5000
├── docker-compose.yml     # Orchestrate all 3 services
├── .env
└── README.md
```

## 🚀 API Endpoints

| Method | Endpoint     | Mô tả                        |
|--------|--------------|------------------------------|
| GET    | /health      | Health check `{"status":"ok"}` |
| GET    | /about       | Lấy thông tin sinh viên      |
| POST   | /about       | Tạo / cập nhật hồ sơ         |
| PUT    | /about/:id   | Cập nhật theo ID             |
| GET    | /notes       | Lấy danh sách ghi chú        |
| POST   | /notes       | Thêm ghi chú mới             |
| DELETE | /notes/:id   | Xóa ghi chú                  |
| GET    | /notes       | Lấy danh sách ghi chú        |
| POST   | /notes       | Thêm ghi chú mới             |
| DELETE | /notes/:id   | Xóa ghi chú                  |

## 🔑 Environment Variables

| Biến        | Mặc định                            | Mô tả               |
|-------------|-------------------------------------|---------------------|
| PORT        | 5000                                | Port backend        |
| DB_URL      | mongodb://mongo:27017/studentdb     | MongoDB connection  |
| APP_NAME    | Student Profile App                 | Tên ứng dụng        |

---

## 🐳 Chạy với Docker Compose

### 1. Clone / tải project về

```bash
cd student-app
```

### 2. Chạy toàn bộ hệ thống

```bash
docker compose up --build
```

Sau khi khởi động:
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:5000
- **Health Check** → http://localhost:5000/health

### 3. Dừng hệ thống

```bash
docker compose down
```

Xóa cả data (volume):
```bash
docker compose down -v
```

---

## 🛠️ Chạy Development (không Docker)

### Backend

```bash
cd backend
npm install
# Cần MongoDB đang chạy local
DB_URL=mongodb://localhost:27017/studentdb npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Mở http://localhost:3000
```

---

## 🐋 Docker Hub — Build & Push

> Thay `YOUR_USERNAME` bằng Docker Hub username của bạn.

### Build images

```bash
# Backend
docker build -t YOUR_USERNAME/student-backend:latest ./backend

# Frontend (build context = project root để có nginx/default.conf)
docker build \
  -t YOUR_USERNAME/student-frontend:latest \
  -f frontend/Dockerfile \
  .
```

### Login & Push

```bash
docker login

docker push YOUR_USERNAME/student-backend:latest
docker push YOUR_USERNAME/student-frontend:latest
```

### Pull & chạy từ Docker Hub

```bash
# Cập nhật docker-compose.yml để dùng image từ Hub thay vì build local:
# Thay:
#   build: ./backend
# Thành:
#   image: YOUR_USERNAME/student-backend:latest

docker compose up
```

---

## 🔍 Debug

```bash
# Xem logs tất cả services
docker compose logs -f

# Xem logs riêng từng service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo

# Vào trong container
docker exec -it student-backend sh
docker exec -it student-mongo mongosh

# Kiểm tra containers đang chạy
docker ps

# Xem network
docker network ls
docker network inspect student-app_app-network
```

---

## 🏗️ Kiến trúc hệ thống

```
Browser (http://localhost:3000)
        │
        ▼
┌───────────────────┐
│  Frontend (nginx) │  port 80 (mapped 3000)
│  React SPA        │
└───────┬───────────┘
        │ /api/* → strip /api → proxy to backend:5000
        ▼
┌───────────────────┐
│  Backend (Node)   │  port 5000
│  Express + Mongoose│
└───────┬───────────┘
        │ mongoose connect
        ▼
┌───────────────────┐
│  MongoDB          │  port 27017 (internal)
│  mongo:7          │  Volume: mongo_data
└───────────────────┘
```

---

## 📋 Checklist yêu cầu

- [x] **Frontend**: React — hiển thị dữ liệu, form tương tác
- [x] **Backend**: Node.js — GET + POST + PUT + DELETE
- [x] **CSDL**: MongoDB — chạy container riêng với persistent volume
- [x] **Trang /about**: Họ tên, MSSV, Lớp, Chuyên ngành, Email, Bio- [x] **Trang /notes**: Danh sách ghi chú với form thêm mới- [x] **Health Check /health**: `{"status":"ok", ...}`
- [x] **Environment Variables**: PORT, DB_URL, APP_NAME
- [x] **Dockerfile Backend**: `backend/Dockerfile`
- [x] **Dockerfile Frontend**: `frontend/Dockerfile` (multi-stage)
- [x] **Docker Compose**: `docker-compose.yml` — Backend + Frontend + MongoDB
- [x] **Docker Hub**: Build + Push instructions
