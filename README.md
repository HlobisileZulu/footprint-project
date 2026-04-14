# 🌱 Footprint Logger

A web application that helps users track their daily carbon dioxide (CO2) emissions, understand their environmental impact, and get personalised tips to reduce their footprint.

Built as a Data Analytics Capstone project.

---

## 🔗 Live Demo

[View the live app on Vercel](https://your-app-name.vercel.app)

---

## 📸 Features

- **User Accounts** — Register and log in securely. Sessions are saved so you stay logged in.
- **Activity Logging** — Log daily activities like car trips, meals, and electricity use. Each activity has a CO2 value assigned to it.
- **Running Total** — See your emissions update in real time as you log activities.
- **Dashboard** — View a summary of your emissions with charts, a 7-day streak tracker, and a comparison to the global community average.
- **Insights** — Get personalised tips based on your highest-emitting categories and track your weekly goal progress.
- **Category Filtering** — Filter activities by Transport, Food, Energy, or Goods.
- **Custom Activities** — Add your own activities with a custom CO2 value.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript | Frontend — structure, styling, and interactivity |
| Node.js | Backend runtime environment |
| Express.js | Web server and API routing |
| MongoDB Atlas | Cloud database for storing users and logs |
| Mongoose | MongoDB object modelling |
| bcryptjs | Password hashing for security |
| express-session | User session management |
| connect-mongo | Storing sessions in MongoDB |
| Chart.js | Dashboard charts and visualisations |

---

## 📁 Project Structure

```
footprint-logger/
  server.js              ← Main server entry point
  vercel.json            ← Vercel deployment config
  package.json           ← Project dependencies
  .env.example           ← Template for environment variables
  .gitignore             ← Files excluded from Git
  models/
    User.js              ← User database schema
    Log.js               ← Activity log database schema
  routes/
    auth.js              ← Register, login, logout routes
    logs.js              ← Create, read, delete log routes
  public/
    index.html           ← Main HTML page
    css/
      style.css          ← All styling
    js/
      app.js             ← Frontend JavaScript
```

---

## ⚙️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/footprint-logger.git
cd footprint-logger
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project based on the `.env.example` file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=any_random_string_you_choose
PORT=3000
```

### 4. Start the development server

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

---

## 🚀 Deploying to Vercel

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** and import your repository
4. Add your environment variables in the Vercel dashboard under **Settings > Environment Variables**
5. Click **Deploy**

---

## 🌍 CO2 Reference Values

Activity CO2 values are based on internationally recognised emissions data from:

- UK Government GHG Conversion Factors (2023)
- Our World in Data
- Poore & Nemecek, Science (2018)
- IPCC AR6 (2023)

---

## 📄 Licence

This project was built for educational purposes as part of a Data Analytics Capstone.
