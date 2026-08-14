# Homemate

Homemate is a full-stack, two-sided marketplace built on the MERN stack. It connects homeowners with trusted, vetted home service professionals (like electricians, plumbers, and cleaners) for a seamless booking experience.

## ✨ Features

* **Dual-Role Authentication:** Separate, secure dashboards for Customers and Service Providers.
* **Smart Matching:** Customers book services, and those requests are routed to professionals with matching skills.
* **Provider Dashboard:** Experts can view available jobs, accept requests, mark jobs as completed, and track total revenue.
* **Review System:** Customers can leave a 1-to-5 star rating and review for completed jobs.
* **Protected Routes:** React Router intercepts unauthorized access based on user roles (Customer, Provider, Admin).
* **Responsive Premium UI:** Built with raw CSS featuring glassmorphism, gradient shifts, and a mobile-friendly layout.

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router DOM, Context API, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Security:** Context-based route protection

## 🚀 How to Run Locally

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Jyotiranjan58/homemate.git
cd homemate
\`\`\`

### 2. Install Dependencies
You will need to install the node modules for both the frontend and the backend.
\`\`\`bash
# Install backend dependencies
cd backend
npm install

# Open a new terminal and install frontend dependencies
cd ../frontend
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file inside the **backend** folder and add:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/homemate_v2
\`\`\`

Create a `.env` file inside the **frontend** folder and add:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 4. Start the Application
Run both servers simultaneously in two separate terminals.

**Terminal 1 (Backend):**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2 (Frontend):**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## 👑 Admin Access
To access the `/admin` dashboard to approve new professionals, you must manually promote a user account in your MongoDB database using mongosh or MongoDB Compass:
\`\`\`json
{ "$set": { "role": "admin" } }
\`\`\`
