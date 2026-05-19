import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollApi } from '../api/axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    pollApi.get('/polls/active')
      .then(res => setPolls(res.data))
      .catch(() => setError('Failed to load polls'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="page-title">Active Polls</h1>
        <p className="page-subtitle">Select a poll to cast your vote and see live results</p>

        {error && <div className="alert alert-error">{error}</div>}
        {loading && <LoadingSpinner />}

        {!loading && polls.length === 0 && (
          <div className="empty-state">
            <h3>No active polls right now</h3>
            <p>Check back later or ask an admin to create a poll.</p>
          </div>
        )}

        <div className="poll-grid">
          {polls.map(poll => (
            <div key={poll.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-active">Active</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {poll.options.length} options
                </span>
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem' }}>{poll.title}</h3>
              {poll.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {poll.description}
                </p>
              )}
              <Link to={`/poll/${poll.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Vote Now →
              </Link>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">© 2024 PollStream — Real-Time Polling Platform</footer>
    </div>
  );
}
