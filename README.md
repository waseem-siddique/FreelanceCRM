# Freelance CRM 💼

A modern, full-stack Customer Relationship Management (CRM) platform built specifically for freelancers to manage their clients, track projects, and analyze revenue effortlessly.

## 🚀 Features

- **Client Management**: Add, edit, and keep track of your clients' details, emails, and company information.
- **Project Tracking**: Create projects linked to specific clients, set deadlines, budgets, and track progress via task modules.
- **Revenue Analytics**: Dynamic dashboards visualizing your realized (paid) revenue versus pending revenue, with a comprehensive list of recent financial transactions.
- **Invoicing System**: Generate professional invoice PDFs dynamically based on completed project data.
- **Beautiful UI**: Modern, responsive design powered by Tailwind CSS and Framer Motion with immersive light and dark mode support.
- **Authentication**: Secure JWT-based user authentication.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (HTTP Client)

### Backend
- **Node.js** & **Express** (API framework)
- **MongoDB** & **Mongoose** (Database)
- **JWT** (Authentication)

---

## 💻 Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/waseem-siddique/FreelanceCRM.git
cd freelance-crm
```

### 2. Install Dependencies

You'll need to install dependencies for both the `client` and `server`.

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Setup Environment Variables

**Server (`server/.env`)**
Create a `.env` file in the `server` directory and add your MongoDB connection string and a JWT secret:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**Client (`client/.env`)**
Create a `.env` file in the `client` directory to connect to your local backend API:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

Open two separate terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm start
```
*(The server will start at `http://localhost:5000`)*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*(The Vite frontend will be available at `http://localhost:5173`)*

---

## 🌍 Deployment

- **Frontend**: Can be easily deployed to [Vercel](https://vercel.com/) by pointing the build directory to `/client` and providing the production backend URL to the `VITE_API_URL` environment variable.
- **Backend**: Can be hosted on platforms like [Render](https://render.com/) or Heroku. Make sure to update the environment variables in your hosting dashboard securely.

---
*Built with ❤️ for freelancers.*
