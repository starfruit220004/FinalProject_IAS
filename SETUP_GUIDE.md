# SecureLearn — Step-by-Step Setup Guide

## Project Structure

```
finalproject-app/
├── backend/
│   ├── db/
│   │   └── index.js          ← DB connection + seed data
│   ├── middleware/
│   │   └── auth.js           ← JWT verification middleware
│   ├── routes/
│   │   ├── auth.js           ← /api/auth/login & /register
│   │   └── content.js        ← /api/content/blogs, flashcards, quizzes
│   ├── server.js             ← Express entry point
│   ├── package.json
│   ├── .env                  ← Local environment variables
│   └── .env.production       ← Production environment variables
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js ← Global auth state
    │   ├── components/
    │   │   ├── Navbar.js      ← Navigation bar
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── BlogPage.js
    │   │   ├── FlashcardsPage.js
    │   │   └── QuizPage.js
    │   ├── api.js             ← Fetch helper
    │   ├── App.js             ← Routes
    │   ├── index.js
    │   └── index.css          ← Deep Ocean theme variables
    ├── package.json
    ├── .env                   ← Local API URL
    └── .env.production        ← Production API URL
```

---

## STEP 1 — Create the PostgreSQL Database

1. Open **pgAdmin 4** on your computer.
2. In the left panel, right-click **Databases → Create → Database**.
3. Name it exactly: `finalproject_db`
4. Click **Save**.

> The tables and seed data are created automatically when the backend starts.

---

## STEP 2 — Set Up the Backend

### 2a. Open the backend folder in VS Code terminal

```bash
cd finalproject-app/backend
```

### 2b. Open `.env` and fill in your pgAdmin password

```
DB_PASSWORD=your_pgadmin_password_here
```
> Leave everything else as-is for local development.

### 2c. Install dependencies

```bash
npm install
```

### 2d. Start the backend server

```bash
npm run dev
```

You should see:
```
Database initialized successfully
Server running on http://localhost:5000
```

> If you see a DB connection error, double-check your `DB_PASSWORD` in `.env`.

---

## STEP 3 — Set Up the Frontend

### 3a. Open a NEW terminal and go to the frontend folder

```bash
cd finalproject-app/frontend
```

### 3b. Install dependencies

```bash
npm install
```

### 3c. Start the React app

```bash
npm start
```

Your browser will open at `http://localhost:3000` automatically.

---

## STEP 4 — Use the App

1. Go to `http://localhost:3000`
2. Click **Register** — create an account with username, email, and password
3. Log in with your new account
4. You'll land on the **Dashboard** — choose from:
   - **Blog** — read security articles
   - **Flashcards** — flip through concept cards
   - **Quiz** — answer multiple-choice questions with instant feedback

---

## API Endpoints (for reference / Postman testing)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/content/blogs` | Yes | Get all blog posts |
| GET | `/api/content/blogs/:id` | Yes | Get single blog |
| GET | `/api/content/flashcards` | Yes | Get all flashcards |
| GET | `/api/content/quizzes` | Yes | Get all quiz questions |
| POST | `/api/content/quizzes/check` | Yes | Check quiz answer |

---

## Security Features Explained

### 1. Password Hashing (bcrypt)
Passwords are never stored in plain text. Before saving to the database, the password goes through:
```javascript
const password_hash = await bcrypt.hash(password, 10);
```
The `10` is the salt rounds — higher means slower hashing, which resists brute force attacks.

### 2. JWT Authentication
After login, a signed token is returned:
```javascript
jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' })
```
Every protected route verifies this token in `middleware/auth.js` before granting access.

### 3. Parameterized Queries (SQL Injection prevention)
User input is never concatenated into SQL strings:
```javascript
// SAFE — user input is a separate parameter, never part of the SQL string
pool.query('SELECT * FROM users WHERE username = $1', [username])
```

### 4. Input Validation
`express-validator` checks all form inputs before they reach the database:
- Username: 3–50 chars, alphanumeric only
- Email: must be valid email format
- Password: minimum 6 characters

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `password authentication failed for user "postgres"` | Update `DB_PASSWORD` in `backend/.env` |
| `database "finalproject_db" does not exist` | Create it in pgAdmin (Step 1) |
| `Cannot find module 'express'` | Run `npm install` inside the backend folder |
| Frontend shows blank page | Make sure backend is running on port 5000 |
| `CORS error` in browser console | Check `CLIENT_URL` in `backend/.env` matches `http://localhost:3000` |

---

## Production Notes

- Copy `.env.production` values into your hosting platform's environment variables
- For the frontend, set `REACT_APP_API_URL` to your deployed backend URL
- Run `npm run build` in the frontend folder to create a production build
- Never commit `.env` files to GitHub — add them to `.gitignore`
