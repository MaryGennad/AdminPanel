// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

type Item = { id: string; text: string };

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempText, setTempText] = useState('');

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        // ✅ Проверяем, что data — массив
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('API returned non-array:', data);
          setItems([]); // или дефолтные значения
        }
      })
      .catch(err => {
        console.error('Fetch failed:', err);
        setItems([]);
      });
  }, []);

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setTempText(text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    fetch('/api/items/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, text: tempText }),
    }).then(() => {
      setItems(items.map(i => i.id === editingId ? { ...i, text: tempText } : i));
      setEditingId(null);
    });
  };
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', background: '#111', color: '#eee' }}>
      <h1>Мой магазин</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        {items.map(item => (
          <div key={item.id} style={{ background: '#222', padding: '20px', borderRadius: '8px', width: '150px', textAlign: 'center' }}>
            {editingId === item.id ? (
              <>
                <input
                  value={tempText}
                  onChange={e => setTempText(e.target.value)}
                  style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                />
                <button onClick={saveEdit} style={{ background: '#0a0', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <div>{item.text}</div>
                <button
                  onClick={() => startEdit(item.id, item.text)}
                  style={{ marginTop: '10px', background: '#0070f3', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
                >
                  ✏️
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}