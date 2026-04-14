# 🌱 Footprint Logger
## 📸 Features

- **User Accounts** — Register and log in securely. Sessions are saved so you stay logged in.
- **Activity Logging** — Log daily activities like car trips, meals, and electricity use. Each activity has a CO2 value assigned to it.
- **Running Total** — See your emissions update in real time as you log activities.
- **Dashboard** — View a summary of your emissions with charts, a 7-day streak tracker, and a comparison to the global community average.
- **Insights** — Get personalised tips based on your highest-emitting categories and track your weekly goal progress.
- **Category Filtering** — Filter activities by Transport, Food, Energy, or Goods.
- **Custom Activities** — Add your own activities with a custom CO2 value.


## 🛠️ Technologies Used
 HTML, CSS, JavaScript | Frontend — structure, styling, and interactivity 
 Node.js | Backend runtime environment 
 Express.js | Web server and API routing 
 MongoDB Atlas | Cloud database for storing users and logs 
 Mongoose | MongoDB object modelling 
 bcryptjs | Password hashing for security 
 express-session | User session management 
 connect-mongo | Storing sessions in MongoDB 
 Chart.js | Dashboard charts and visualisations 

## ⚙️ Running Locally

### 1. Clone the repository

-bash
git clone https://github.com/your-username/footprint-logger.git
cd footprint-logger

### 2. Install dependencies

-bash
npm install

### 3. Set up environment variables

Create a `.env` file in the root of the project:

Then open `.env` and fill in your values:

MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=any_random_string_you_choose
PORT=3000

### 4. Start the development server

-bash
npm run dev

Open your browser and go to: **http://localhost:3000**

## 🚀 Deploying to Vercel

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** and import your repository
4. Add your environment variables in the Vercel dashboard under **Settings > Environment Variables**
5. Click **Deploy**

## 🌍 CO2 Reference Values

Activity CO2 values are based on internationally recognised emissions data from:

- UK Government GHG Conversion Factors (2023)
- Our World in Data
- Poore & Nemecek, Science (2018)
- IPCC AR6 (2023)

