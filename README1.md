# Todo App

Full-stack Todo application — React frontend + Node/Express backend + SQLite database, fully Dockerised.

## Stack
- **Frontend**: React 18, served via Nginx
- **Backend**: Node.js, Express
- **Database**: SQLite (via better-sqlite3), stored locally in `./data/todos.db`

---

## Run with Docker (recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

```bash
# 1. Clone or download the project
cd todo-app

# 2. Build and start both containers
docker-compose up --build

# 3. Open your browser
open http://localhost:3000
```

To stop:
```bash
docker-compose down
```

Your data lives in `./data/todos.db` — it persists across restarts.

---

## Run without Docker (local dev)

### Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

> For local dev, change the proxy in `frontend/package.json` from `http://backend:5000` to `http://localhost:5000`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/todos?filter=all|active|completed | List todos |
| POST | /api/todos | Create todo |
| PUT | /api/todos/:id | Update todo |
| DELETE | /api/todos/:id | Delete todo |
| DELETE | /api/todos | Clear completed |
| GET | /api/stats | Get counts |

---

## Data Persistence

SQLite database is stored at `./data/todos.db` on your host machine, mounted into the backend container. Safe to back up, copy, or inspect with any SQLite viewer.
