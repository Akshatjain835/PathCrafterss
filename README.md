# 🌍 PathCrafterss

PathCrafterss is an **AI-powered travel planning platform** that helps users create personalized itineraries, discover destinations, manage trips, and access travel insights in one place. The platform simplifies travel planning by combining itinerary generation, destination exploration, weather information, and trip management into a seamless experience.

![React](https://img.shields.io/badge/Frontend-React-blue?style=flat&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-4DB33D?style=flat&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)

---

## 🚀 What is PathCrafterss?

Planning a trip can be overwhelming, requiring users to browse multiple platforms for destinations, attractions, weather forecasts, and schedules. PathCrafterss solves this problem by providing an all-in-one travel planning solution.

With PathCrafterss, users can:

- Generate personalized travel itineraries
- Discover destinations and attractions
- Organize day-wise travel schedules
- Access weather and travel information
- Manage and save multiple trips
- Enjoy a responsive and user-friendly experience

---

## 🌐 Demo

- **Frontend:** https://your-frontend-url.vercel.app
- **Backend API:** https://your-backend-url.onrender.com

---

## ✨ Features

### ✈️ Smart Travel Planning
- AI-powered itinerary generation
- Personalized trip recommendations
- Day-wise travel scheduling
- Multi-destination trip planning

### 🗺️ Destination Discovery
- Explore popular destinations
- View attractions and activities
- Discover local travel insights

### 🌦️ Travel Intelligence
- Weather information integration
- Travel recommendations
- Seasonal destination insights

### 📅 Itinerary Management
- Create, edit, and delete itineraries
- Organize travel activities
- Manage trip schedules efficiently

### 🔐 Authentication & Security
- Secure authentication with Clerk
- Protected routes and APIs
- User-specific trip management

### 📱 Responsive Experience
- Mobile-friendly design
- Modern UI/UX
- Fast and intuitive navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React.js, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Clerk |
| API Communication | Axios |
| UI Components | Lucide React |
| Deployment | Vercel, Render |

---

## 📂 Project Structure

```bash
PathCrafterss
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── cron/
│   └── server.js
│
├── README.md
└── package.json
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Akshatjain835/PathCrafterss.git
cd PathCrafterss
```

---

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5001
VITE_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
```

Start frontend:

```bash
npm run dev
```

---

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5001

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY

JWT_SECRET=YOUR_JWT_SECRET

WEATHER_API_KEY=YOUR_WEATHER_API_KEY
```

Start backend:

```bash
npm run dev
```

---

## 🔑 Environment Variables

### Frontend

| Variable | Description |
|-----------|------------|
| VITE_API_URL | Backend API URL |
| VITE_CLERK_PUBLISHABLE_KEY | Clerk Publishable Key |

### Backend

| Variable | Description |
|-----------|------------|
| PORT | Server Port |
| MONGODB_URI | MongoDB Connection String |
| CLERK_SECRET_KEY | Clerk Secret Key |
| JWT_SECRET | JWT Secret |
| WEATHER_API_KEY | Weather Service API Key |

---

## 📸 Screenshots

### Home Page

```md
![Home](screenshots/home.png)
```

### Destination Explorer

```md
![Destinations](screenshots/destinations.png)
```

### Trip Planner

```md
![TripPlanner](screenshots/trip-planner.png)
```

### Itinerary Dashboard

```md
![Itinerary](screenshots/itinerary.png)
```

---

## 🚀 Future Enhancements

- AI-based travel recommendations
- Budget estimation and planning
- Hotel booking integration
- Flight booking integration
- Interactive maps
- Collaborative trip planning
- Offline itinerary support
- Real-time travel alerts

---

## 🤝 Contributing

1. Fork the repository

```bash
git fork
```

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Akshat Jain**

GitHub: https://github.com/Akshatjain835

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Show Your Support

If you found this project useful, please consider giving it a **star ⭐** on GitHub.

**Happy Traveling! ✈️🌍**
