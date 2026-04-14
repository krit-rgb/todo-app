import { useTodos } from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

const FILTERS = ['all', 'active', 'completed'];

export default function App() {
  const {
    todos, stats, filter, setFilter,
    loading, error,
    addTodo, toggleTodo, editTodo, removeTodo, clearDone,
  } = useTodos();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>◆</span>
            <h1 style={styles.title}>Todos</h1>
          </div>
          <div style={styles.statsRow}>
            <StatPill label="Total" value={stats.total} />
            <StatPill label="Active" value={stats.active} />
            <StatPill label="Done" value={stats.completed} />
          </div>
        </header>

        <TodoForm onAdd={addTodo} />

        <div style={styles.toolbar}>
          <div style={styles.filters}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {stats.completed > 0 && (
            <button onClick={clearDone} style={styles.clearBtn}>
              Clear completed
            </button>
          )}
        </div>

        {error && (
          <div style={styles.error}>
            Connection error — make sure the backend is running.
          </div>
        )}

        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : todos.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>○</span>
            <p>{filter === 'all' ? 'No tasks yet. Add one above.' : `No ${filter} tasks.`}</p>
          </div>
        ) : (
          <div>
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onDelete={removeTodo}
              />
            ))}
          </div>
        )}

        <footer style={styles.footer}>
          {stats.active} task{stats.active !== 1 ? 's' : ''} remaining
        </footer>
      </div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5', padding: '40px 16px' },
  container: { maxWidth: 600, margin: '0 auto' },
  header: { marginBottom: 24 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  logoIcon: { fontSize: 18, color: '#000' },
  title: { fontSize: 26, fontWeight: 600, color: '#111', letterSpacing: '-0.5px' },
  statsRow: { display: 'flex', gap: 10 },
  stat: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '10px 20px', minWidth: 72,
  },
  statValue: { fontSize: 22, fontWeight: 600, color: '#111' },
  statLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16,
  },
  filters: { display: 'flex', gap: 4, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 4 },
  filterBtn: {
    padding: '5px 14px', background: 'none', border: 'none',
    borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#6b7280', fontWeight: 400,
  },
  filterActive: { background: '#111', color: '#fff' },
  clearBtn: {
    background: 'none', border: 'none', color: '#9ca3af', fontSize: 13,
    cursor: 'pointer', textDecoration: 'underline',
  },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
    padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 16,
  },
  empty: {
    textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: 15,
  },
  emptyIcon: { display: 'block', fontSize: 32, marginBottom: 12, color: '#d1d5db' },
  footer: {
    textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9ca3af',
  },
};
