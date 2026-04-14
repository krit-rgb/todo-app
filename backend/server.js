const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'todos.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

app.use(cors());
app.use(express.json());

app.get('/api/todos', (req, res) => {
  try {
    const { filter, priority } = req.query;
    let query = 'SELECT * FROM todos';
    const conditions = [];
    if (filter === 'active') conditions.push('completed = 0');
    if (filter === 'completed') conditions.push('completed = 1');
    if (priority) conditions.push(`priority = '${priority}'`);
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';
    const todos = db.prepare(query).all();
    res.json(todos.map(t => ({ ...t, completed: Boolean(t.completed) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { title, description = '', priority = 'medium' } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });
    const stmt = db.prepare(
      'INSERT INTO todos (title, description, priority) VALUES (?, ?, ?)'
    );
    const result = stmt.run(title.trim(), description.trim(), priority);
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...todo, completed: Boolean(todo.completed) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;
    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Todo not found' });
    const updated = {
      title: title !== undefined ? title.trim() : existing.title,
      description: description !== undefined ? description : existing.description,
      completed: completed !== undefined ? (completed ? 1 : 0) : existing.completed,
      priority: priority !== undefined ? priority : existing.priority,
    };
    db.prepare(
      `UPDATE todos SET title=?, description=?, completed=?, priority=?,
       updated_at=datetime('now') WHERE id=?`
    ).run(updated.title, updated.description, updated.completed, updated.priority, id);
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json({ ...todo, completed: Boolean(todo.completed) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Todo not found' });
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/todos', (req, res) => {
  try {
    db.prepare('DELETE FROM todos WHERE completed = 1').run();
    res.json({ message: 'Cleared completed todos' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM todos').get().count;
    const completed = db.prepare('SELECT COUNT(*) as count FROM todos WHERE completed=1').get().count;
    const active = total - completed;
    res.json({ total, completed, active });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
