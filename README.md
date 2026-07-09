## ⚡ AceIt — AI-Powered Placement Preparation Platform


Crack your dream company interviews with AI-powered mock interviews, resume analysis, and DSA tracking.



AceIt is a full-stack placement preparation platform built for engineering students. It provides company-specific mock interviews with AI feedback, resume analysis, DSA progress tracking, and daily coding challenges — all in one place.


## Features


AI Mock Interviews — Company-specific interview rounds (Google, Microsoft, Amazon, Meta, Apple) with 3 rounds and 2 questions each. Get detailed AI feedback on every answer.
Online Assessment (OA) Simulator — Practice company-specific OA rounds including DSA coding problems and Amazon-style debugging MCQs with a live timer.
Resume Analyzer — Upload your PDF resume and get AI-powered feedback including overall score, strengths, weaknesses, missing skills, and suggestions.
DSA Progress Tracker — Track your progress across 12+ DSA topics with progress bars, filters, and MongoDB-backed persistent storage.
Daily Challenge — Get a fresh DSA problem every day with difficulty rating and example input/output.
Analytics Dashboard — View your interview history, DSA topic progress, and weak areas at a glance.
User Authentication — Secure JWT-based login and registration — every user gets their own data.


## Tech Stack

Frontend


React — Component-based UI
React Router — Client-side routing
Tailwind CSS — Utility-first styling
Lucide React — Icons
Vite — Build tool


Backend


Node.js + Express — REST API server
MongoDB + Mongoose — Database
JWT + bcryptjs — Authentication
Multer — PDF file upload
pdf-parse — PDF text extraction
Groq API (LLaMA 3.3) — AI question generation and feedback



## Project Structure

AceIt/
├── prepai-frontend/          # React frontend
│   ├── src/
│   │   ├── components/       # Sidebar, Layout
│   │   ├── pages/            # Dashboard, MockInterview, DSAPractice, etc.
│   │   │   └── components/   # Dashboard sub-components
│   │   ├── data/             # Initial topics data
│   │   └── App.jsx
│   └── package.json
│
└── prepai-backend/           # Express backend
    ├── controllers/          # Route handlers
    ├── models/               # Mongoose schemas
    ├── middleware/            # Auth middleware
    └── index.js


## Setup & Installation

Prerequisites


Node.js v20+
MongoDB Atlas account
Groq API key (free at console.groq.com)


1. Clone the repository

bashgit clone https://github.com/bt24cs030-svg/aceit-placement-prep.git
cd aceit-placement-prep

2. Backend Setup

bashcd prepai-backend
npm install

Create .env file:

MONGODB_URI=my_mongodb_connection_string
GROQ_API_KEY=my_groq_api_key
JWT_SECRET=my_jwt_secret
PORT=4000

Start backend:

node index.js

3. Frontend Setup

bashcd prepai-frontend
npm install
npm run dev

Open http://localhost:5173 in your browser.


## How It Works


Register/Login — Create your account to save your progress
Start Mock Interview — Select company → Complete OA → 3 Interview Rounds → Get AI feedback
Track DSA — Update your solved count per topic → Save to database
Analyze Resume — Upload PDF → Get detailed AI feedback
Daily Challenge — Solve a new DSA problem every day



## Upcoming Features


 LeetCode integration — auto-sync solved problems
 Company-wise question bank
 Peer mock interviews
 Study plan generator
 Mobile app



## Author

Madhurendra Gupta


NIT Mizoram — B.Tech Computer Science
GitHub: bt24cs030-svg



## License

MIT License — feel free to use and modify!



Built with ❤️ for engineering students who want to crack their dream company placements.
# aceit-placement-prep
