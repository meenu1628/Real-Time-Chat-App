# Zinkly Chat App

A full-stack real-time chat application built for seamless communication, featuring user authentication, group messaging, online status, and a modern UI.

---

## Features

- **Real-Time Messaging:** Instantly send and receive messages using Socket.IO.
- **Group Chats:** Create, join, and manage group conversations.
- **User Authentication:** Secure signup and login with JWT and bcryptjs.
- **Online Presence:** See which users are online and when they were last seen.
- **Profile Management:** Update your profile picture and personal info.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Typing Indicators:** See when other users are typing in a room.

---

## Tech Stack

- **Frontend:** React, Zustand, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Realtime:** Socket.IO
- **Authentication:** JWT, bcryptjs

---

## Project Structure

```
chat-app/
  backend/
    src/
      models/         # Mongoose models (User, Message, Room)
      routes/         # Express routes
      controllers/    # Route controllers
      queries/        # DB Queries
      socket/         # Socket event handlers
      utils/          # Utility Func  (Generate Otp,Generate Token)
    .env
    index.js
  frontend/
    src/
      components/     # Reusable UI components
      pages/          # Page components (Home, Chat, etc.)
      hooks/          # Custom React hooks (useChatSelectors)
      stores/         # Zustand stores (chatStore, socketStore)
      lib/            # Utilities (socket.js, type.js)
    .env
    App.jsx
    README.md
```

---

## Setup Instructions

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/zinkly-chat-app.git
cd chat-app
```

### 2. Install dependencies

```sh
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configure environment variables

- Copy `.env.example` to `.env` in both `backend` and `frontend` folders.
- Set your MongoDB URI, JWT secret, and other required variables.

### 4. Seed dummy data (optional)

- Run `node backend/test.js` to insert dummy users and messages for testing.

### 5. Start the backend server

```sh
cd backend
npm start 
    or
nodemon start 
```

### 6. Start the frontend

```sh
cd frontend
npm run dev
```

### 7. Access the app

- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Development Notes

- **Socket Store:** The frontend uses Zustand for socket state management (`src/stores/socketStore.js`).
- **Custom Hooks:** Real-time events and chat logic are handled via hooks in `src/hooks/`.
- **Error Handling:** Socket errors and connection status are managed and displayed in the UI.
- **Case Sensitivity:** Ensure all imports match file casing to avoid cross-platform issues.

---

## License
