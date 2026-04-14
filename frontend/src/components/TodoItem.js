import { useState } from 'react';

const PRIORITY_DOT = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    await onEdit(todo.id, { title: editTitle, description: editDesc });
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={styles.item}>
        <input
          style={{ ...styles.editInput, marginBottom: 8 }}
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          autoFocus
        />
        <textarea
          style={styles.editTextarea}
          value={editDesc}
          onChange={e => setEditDesc(e.target.value)}
          rows={2}
          placeholder="Description (optional)"
        />
        <div style={styles.editActions}>
          <button onClick={saveEdit} style={styles.saveBtn}>Save</button>
          <button onClick={cancelEdit} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.item, opacity: todo.completed ? 0.6 : 1 }}>
      <div style={styles.left}>
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          style={{ ...styles.checkbox, background: todo.completed ? '#000' : '#fff' }}
          aria-label="Toggle complete"
        >
          {todo.completed && <span style={styles.check}>✓</span>}
        </button>
        <span
          style={{
            ...styles.dot,
            background: PRIORITY_DOT[todo.priority] || '#888',
          }}
        />
      </div>
      <div style={styles.content}>
        <p style={{ ...styles.title, textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.title}
        </p>
        {todo.description && (
          <p style={styles.desc}>{todo.description}</p>
        )}
        <p style={styles.meta}>
          {new Date(todo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' · '}
          <span style={{ color: PRIORITY_DOT[todo.priority], textTransform: 'capitalize' }}>
            {todo.priority}
          </span>
        </p>
      </div>
      <div style={styles.actions}>
        <button onClick={() => setEditing(true)} style={styles.actionBtn} title="Edit">✎</button>
        <button onClick={() => onDelete(todo.id)} style={{ ...styles.actionBtn, color: '#ef4444' }} title="Delete">✕</button>
      </div>
    </div>
  );
}

const styles = {
  item: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '14px 16px', marginBottom: 10, display: 'flex',
    alignItems: 'flex-start', gap: 12, transition: 'box-shadow 0.15s',
  },
  left: { display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, border: '1.5px solid #d1d5db',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, padding: 0,
  },
  check: { color: '#fff', fontSize: 11, lineHeight: 1 },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  content: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, color: '#111', fontWeight: 400, marginBottom: 2, wordBreak: 'break-word' },
  desc: { fontSize: 13, color: '#6b7280', marginBottom: 4, wordBreak: 'break-word' },
  meta: { fontSize: 12, color: '#9ca3af' },
  actions: { display: 'flex', gap: 4, flexShrink: 0 },
  actionBtn: {
    background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
    color: '#9ca3af', padding: '4px 6px', borderRadius: 6,
  },
  editInput: {
    width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
    borderRadius: 8, fontSize: 14, outline: 'none', display: 'block',
  },
  editTextarea: {
    width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
    borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none',
    fontFamily: 'inherit', display: 'block',
  },
  editActions: { display: 'flex', gap: 8, marginTop: 10 },
  saveBtn: {
    padding: '6px 16px', background: '#000', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer',
  },
  cancelBtn: {
    padding: '6px 16px', background: '#fff', color: '#111',
    border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, cursor: 'pointer',
  },
};
