# 📊 User Analytics Application

A full-stack analytics platform that captures user interactions, stores behavioral data, and visualizes session activity through a real-time analytics dashboard.

Built as a prototype for the **Full Stack Engineer Hiring Challenge at CausalFunnel**, this project simulates an enterprise-grade event tracking pipeline consisting of:

* Client-side tracking SDK
* Event ingestion API
* MongoDB analytics storage
* Real-time dashboard visualization

---

## 🚀 Features

### Event Tracking System

* Automatic anonymous session creation
* Persistent session management using `localStorage`
* Page view tracking
* User click tracking with coordinate capture
* Event timestamp logging
* Structured analytics payload generation

### Analytics Dashboard

* Live session monitoring
* Session-wise event aggregation
* User journey visualization
* Click heatmap generation
* Route-based analytics filtering
* Real-time analytics updates

---

## 🏗️ Architecture

```text
┌─────────────────────┐
│  Tracking Script    │
│ (Vanilla JavaScript)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Express API Server │
│      Node.js        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      MongoDB        │
│ Analytics Database  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   React Dashboard   │
│      (Vite)         │
└─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### Tracking Layer

* Vanilla JavaScript
* Browser Local Storage API

---

## 📂 Project Structure

```text
project-root/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, ensure you have:

* Node.js v16+ installed
* MongoDB running locally

```bash
mongodb://localhost:27017
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone <repository-url>
cd user-analytics-application
```

---

## 2. Backend Setup

Install backend dependencies:

```bash
npm install
```

Start the Express server:

```bash
npm start
```

Backend will be available at:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the Vite development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

---

# 📈 How It Works

## Session Tracking

When a user first visits:

1. A unique anonymous session ID is generated.
2. The session ID is stored in browser localStorage.
3. All subsequent interactions are linked to that session.

---

## Page View Tracking

Whenever the user navigates between pages:

```json
{
  "event": "page_view",
  "page": "/pricing",
  "timestamp": "2026-06-20T12:30:00Z"
}
```

---

## Click Tracking

Clicks inside the interaction area generate:

```json
{
  "event": "click",
  "x": 245,
  "y": 138,
  "page": "/home",
  "timestamp": "2026-06-20T12:31:00Z"
}
```

---

## Analytics Dashboard

The dashboard provides:

### Live Sessions

Displays active user sessions in chronological order.

### User Journeys

Shows a complete timeline of user actions within a session.

### Click Heatmaps

Visualizes click density for selected routes by plotting captured coordinates.

---

# 🎯 Evaluation Checklist

### Tracking Layer

* [x] Session Creation
* [x] Local Storage Persistence
* [x] Page View Tracking
* [x] Click Event Tracking
* [x] Event Timestamping

### Backend API

* [x] Event Ingestion Endpoint
* [x] MongoDB Integration
* [x] Session Aggregation
* [x] Analytics Query APIs

### Dashboard

* [x] Live Session View
* [x] User Journey Timeline
* [x] Click Heatmap Visualization
* [x] Route Filtering

---

# 💡 Design Decisions & Trade-offs

### Monorepo Structure

For simplicity and easier review, both the tracking simulator and analytics dashboard are hosted within the same repository.

In a production environment:

* Tracking SDK would be deployed independently.
* Dashboard would be a separate application.
* API services would be independently scalable.

### Heatmap Coordinates

Current implementation stores absolute pixel coordinates.

Production systems typically store:

* Relative percentages
* DOM element selectors
* Viewport metadata

This ensures accurate rendering across devices and screen sizes.

### Real-Time Updates

The dashboard currently refreshes state after interactions.

For production-scale systems, a better approach would be:

* WebSockets
* Server-Sent Events (SSE)
* Event streaming platforms

for true real-time analytics updates.

---

# 🔮 Future Improvements

* User authentication
* Custom event tracking
* Funnel analytics
* Session replay
* Device & browser analytics
* Real-time WebSocket updates
* Export reports (CSV/PDF)
* Dashboard filtering & search
* Multi-tenant support

---

# 📸 Demo

Add screenshots or GIFs here.

```text
screenshots/
├── dashboard.png
├── user-journey.png
└── heatmap.png
```

---

# 👨‍💻 Author

**Ayush Kumar Dubey**

Full Stack Developer | Node | Html | React | MongoDB | Node.js

Built as part of the CausalFunnel Full Stack Engineer evaluation.
