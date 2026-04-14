const BASE = '/api';

export const fetchTodos = async (filter = 'all') => {
  const res = await fetch(`${BASE}/todos?filter=${filter}`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
};

export const createTodo = async (data) => {
  const res = await fetch(`${BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
};

export const updateTodo = async (id, data) => {
  const res = await fetch(`${BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
};

export const deleteTodo = async (id) => {
  const res = await fetch(`${BASE}/todos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete todo');
  return res.json();
};

export const clearCompleted = async () => {
  const res = await fetch(`${BASE}/todos`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear completed');
  return res.json();
};

export const fetchStats = async () => {
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};
