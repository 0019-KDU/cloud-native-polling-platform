import React, { useState } from 'react';
import { pollApi } from '../api/axios';

export default function CreatePollModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addOption = () => setOptions([...options, '']);
  const removeOption = (i) => setOptions(options.filter((_, idx) => idx !== i));
  const updateOption = (i, val) => {
    const next = [...options];
    next[i] = val;
    setOptions(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const filledOptions = options.filter(o => o.trim());
    if (filledOptions.length < 2) {
      setError('Please add at least 2 options.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await pollApi.post('/polls', {
        title: title.trim(),
        description: description.trim() || null,
        options: filledOptions,
      });
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Create New Poll</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Poll Question *</label>
            <input
              className="form-input"
              placeholder="What would you like to ask?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Additional context..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={1000}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Options *</label>
            {options.map((opt, i) => (
              <div key={i} className="option-input-row">
                <input
                  className="form-input"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={e => updateOption(i, e.target.value)}
                  maxLength={200}
                />
                {options.length > 2 && (
                  <button type="button" className="btn-remove" onClick={() => removeOption(i)}>✕</button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button type="button" className="btn btn-outline btn-sm" onClick={addOption}>+ Add Option</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
