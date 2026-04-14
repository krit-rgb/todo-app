import { useState } from 'react';

const PRIORITY_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title, description, priority });
      setTitle(''); setDescription(''); setPriority('medium'); setExpanded(false);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <input
          style={styles.input}
          placeholder="Add a new task..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
        />
        <button type="submit" disabled={!title.trim() || loading} style={styles.btn}>
          {loading ? '...' : '+'}
        </button>
      </div>
      {expanded && (
        <div style={styles.expanded}>
          <textarea
            style={styles.textarea}
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
          <div style={styles.priorities}>
            {['low', 'medium', 'high'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                style={{
                  ...styles.priorityBtn,
                  background: priority === p ? PRIORITY_COLORS[p] : 'transparent',
                  color: priority === p ? '#fff' : PRIORITY_COLORS[p],
                  border: `1.5px solid ${PRIORITY_COLORS[p]}`,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

const styles = {
  form: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 20 },
  row: { display: 'flex', gap: 10 },
  input: {
    flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8,
    fontSize: 15, outline: 'none', background: '#fafafa',
  },
  btn: {
    padding: '10px 18px', background: '#000', color: '#fff', border: 'none',
    borderRadius: 8, fontSize: 20, cursor: 'pointer', fontWeight: 300,
  },
  expanded: { marginTop: 12 },
  textarea: {
    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8,
    fontSize: 14, resize: 'none', outline: 'none', background: '#fafafa', fontFamily: 'inherit',
  },
  priorities: { display: 'flex', gap: 8, marginTop: 10 },
  priorityBtn: {
    padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
    fontWeight: 500, textTransform: 'capitalize', transition: 'all 0.15s',
  },
};
