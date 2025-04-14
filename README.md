# 📚 SmartBook – Personal Book Collection & Reading Manager

SmartBook is a MERN stack-based web application that enables users to upload, organize, and read digital books online — with support for annotations, reading progress, text-to-speech, and AI-powered summaries. It aims to modernize digital reading experiences with a focus on accessibility, personalization, and centralization.

---

## 🚀 Features

- 📤 Upload your own PDF books
- 🔍 Auto-detect book title and fetch metadata
- 📖 Read books in-browser using PDF.js
- 📝 Annotate with:
  - Highlights
  - Bookmarks
  - Notes (page or text-based)
- 📊 Track reading progress visually
- 🔄 Update reading status (Not Started, In Progress, Completed)
- 📚 Access curated public library
- ❤️ Add platform books to Read List
- 🧠 AI-generated summaries (OpenAI)
- 🔊 Read Aloud (Web Speech API for TTS)

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS / Material UI
- React Router DOM
- PDF.js
- Web Speech API

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Auth
- Multer for file upload
- pdf-parse / pdf-lib
- OpenAI API (for AI summary)

### Cloud
- Cloudinary or Firebase (optional for PDF storage)

---


## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:
```bash
PORT=5000 JWT_SECRET=your_secret_key MONGO_URI=your_mongodb_connection_string
```
---

## 🧪 API Testing with Postman

### Auth Routes
- `POST /api/auth/register`
- `POST /api/auth/login`

### Book Routes
- `POST /api/books/upload` (with PDF file)
- `GET /api/books/my`
- `GET /api/books/public`
- `PUT /api/books/:bookId`
- `DELETE /api/books/:bookId`

---

## 🧰 Installation & Run

### Backend

```bash
cd backend
npm install
npm run dev
```


