# 🩺 MediCard

**MediCard** is a modern web application that allows users to securely manage and access their medical profiles. It includes features such as user authentication, medical data management, emergency QR codes, and profile photo uploads.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Laravel](https://img.shields.io/badge/backend-Laravel-red)
![React](https://img.shields.io/badge/frontend-React-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)

## ⚙️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Laravel + MySQL (or PostgreSQL)
- **Auth**: Laravel Sanctum
- **Image Uploads**: FormData → Laravel Storage
- **Deployment**:
  - React: Firebase Hosting / Vercel
  - Laravel: Render / Railway / DigitalOcean

## 🔑 Features

- ✅ User registration & secure login
- 📄 Health profile creation with photo upload
- 🖼️ Profile photo preview & storage
- 🚨 Emergency QR code for public access
- 🧠 Facial recognition for identity matching
- 🔐 Auth-protected routes and pages
- 🌐 RESTful API built with Laravel

## 📁 Project Structure

```
health-guardian/
├── api/             # Laravel backend
├── frontend/        # React frontend
└── README.md
```

## 🧑‍💻 Local Setup

### Clone the repository

```bash
git clone https://github.com/yourusername/health-guardian.git
cd health-guardian
```

### 1. Backend (Laravel)

```bash
cd api

# Install dependencies
composer install

# Copy and setup .env
cp .env.example .env
php artisan key:generate

# Configure DB in .env, then run:
php artisan migrate

# Link storage
php artisan storage:link

# Start local server
php artisan serve
```

> ✅ Ensure you configure Laravel Sanctum if using cookie-based auth.

### 2. Frontend (React)

```bash
cd ../frontend

# Install frontend dependencies
npm install

# Setup environment
cp .env.example .env
# Update VITE_API_URL to match your Laravel URL

# Run the app
npm run dev
```
### 3. Face Recognition API
```bash
cd ../face-api

# Setup and activate virtualenv (optional)
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## 🖼️ Profile Photos

- Images are uploaded via <input type="file" /> and sent as multipart/form-data.
- Laravel stores them in /public/profile_photos.
- URLs are saved in the DB and used for preview.

## 🧠 Face Matching
  When a photo is uploaded:
  1. Laravel stores the image and sends it to FastAPI.
  
  2. FastAPI compares it with stored encodings in the database.
  
  3. If a match is found, the matching patient’s ID is returned.
  
  4. The React app redirects to /emergency/:userId to show patient data.

## 🚨 Emergency Access

Each user gets a QR code with a unique URL:

```
http://yourdomain.com/emergency/{user_id}
```

This route allows emergency responders to view health details **without logging in**.

## 🔒 Authentication

- Laravel Sanctum handles user authentication with secure cookies.
- Axios on the frontend is configured with withCredentials: true.


## 🙌 Contributing

1. Fork the repo
2. Create your feature branch: git checkout -b feature/feature-name
3. Commit your changes: git commit -m 'add some feature'
4. Push to the branch: git push origin feature/feature-name
5. Open a Pull Request

## 📃 License

This project is licensed under the MIT License.

## 👨‍⚕️ Developed By

**Collins Wachira**
© 2025 Health Guardian. All rights reserved.
