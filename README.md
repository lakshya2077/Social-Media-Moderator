# 🌐 Social Community Moderator & Content Curator

[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

An **AI-powered full-stack platform** for automatically moderating user-generated content in online communities. It uses the **Google Gemini API** to flag inappropriate posts and **Cloudinary** for image storage, while providing moderators with a real-time dashboard built with React.

---

## 🚀 Features

- **🤖 AI Moderation:** Detects spam, toxicity, or rule violations automatically.  
- **📊 Real-Time Dashboard:** Updates flagged posts instantly via **Socket.IO**.  
- **🔒 Secure Authentication:** Supports JWT, email/password login, and **Google OAuth 2.0**.  
- **🖼 Cloud-Based Media:** Images are uploaded and served via **Cloudinary**.  
- **🛠 Modern Tech Stack:** Node.js, Express, Prisma, PostgreSQL, React, Vite.  
- **🐳 Docker-Ready:** Easily run locally or in production using Docker Compose.  

---

## 🛠 Tech Stack

| Layer                 | Technology Stack                  |
| --------------------- | -------------------------------- |
| Frontend              | React, Vite, Chakra UI, Socket.IO |
| Backend               | Node.js, Express.js               |
| Database              | PostgreSQL, Prisma ORM            |
| Real-time Updates     | Socket.IO                         |
| AI Content Analysis   | Google Gemini API                 |
| Media Storage         | Cloudinary                        |
| Authentication        | JWT, Passport.js, Google OAuth 2.0 |
| Containerization      | Docker, Docker Compose            |

---

## 💻 Local Development

### Prerequisites

- Node.js v18+  
- Docker & Docker Compose (optional but recommended)  
- Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))  
- Cloudinary account for image uploads

---

### Installation Steps

**1️⃣ Clone the repository**

```bash
git clone https://github.com/abhishekkushwahaa/Social-Community-Moderator.git
cd Social-Community-Moderator
```

**2️⃣ Configure backend environment variables**

Create a `.env` file inside the `backend` folder:

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@db:5432/mydb?schema=public"

# JWT Secret
JWT_SECRET="YOUR_STRONG_SECRET_KEY"

# Google Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Cloudinary
CLOUDINARY_CLOUD_NAME="YOUR_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_API_KEY"
CLOUDINARY_API_SECRET="YOUR_API_SECRET"
```

**3️⃣ Install dependencies**

```bash
# Backend
cd backend
bun install

# Frontend
cd frontend
bun install
```

---

### 🚀 Running the Application

**Start the development server**

```bash
bun run dev
```

**Initialize the database**

Open a new terminal:

```bash
bunx prisma migrate dev --name init
```

---

## 🌐 Access the App

- **Frontend (React App):** [http://localhost:5173](http://localhost:5173)  
- **Backend API:** [http://localhost:3001](http://localhost:3001)  

---

## 📝 Usage

1. Log in via email/password or Google OAuth.  
2. Compose posts with text or image uploads.  
3. AI scans posts automatically.  
4. Flagged posts appear in the **Removed Posts** tab for moderator review.  
5. Moderators can edit, approve, or delete flagged content.

---

## ⚠️ Notes

- Ensure `.env` variables are correctly configured for **PostgreSQL**, **Google Gemini**, and **Cloudinary**.  
- Docker is optional but recommended for reproducible setups.  
- Cloudinary handles image uploads; verify credentials before using.  

---

## 📂 Folder Structure

```
root/
├─ backend/       # Node.js & Express backend
├─ frontend/      # React + Vite frontend
├─ docker/        # Docker & Docker Compose configs
├─ .env           # Environment variables
└─ README.md
```

---

## 🎯 Contributing

1. Fork the repository  
2. Create your branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add some feature"`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the **MIT License**.

