import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [todosData, statsData] = await Promise.all([
        api.fetchTodos(filter),
        api.fetchStats(),
      ]);
      setTodos(todosData);
      setStats(statsData);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const addTodo = async (data) => {
    const todo = await api.createTodo(data);
    await load();
    return todo;
  };

  const toggleTodo = async (id, completed) => {
    await api.updateTodo(id, { completed });
    await load();
  };

  const editTodo = async (id, data) => {
    await api.updateTodo(id, data);
    await load();
  };

  const removeTodo = async (id) => {
    await api.deleteTodo(id);
    await load();
  };

  const clearDone = async () => {
    await api.clearCompleted();
    await load();
  };

  return {
    todos, stats, filter, setFilter,
    loading, error,
    addTodo, toggleTodo, editTodo, removeTodo, clearDone,
  };
};
