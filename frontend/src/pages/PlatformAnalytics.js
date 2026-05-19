import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../api/axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PlatformAnalytics() {
  const [stats, setStats] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      analyticsApi.get('/analytics/stats'),
      analyticsApi.get('/analytics/polls'),
    ])
      .then(([statsRes, pollsRes]) => {
        setStats(statsRes.data);
        setPolls(pollsRes.data);
      })
      .catch(() => setError('Analytics service is unavailable. Make sure it is running on port 8084.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><LoadingSpinner /></>;

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="page-title">Platform Analytics</h1>
        <p className="page-subtitle" style={{ marginBottom: '2rem' }}>Overview of all polls and votes across the platform</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>
        )}

        {stats && (
          <div className="stat-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-value">{stats.total_polls}</div>
              <div className="stat-label">Total Polls</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.active_polls}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.draft_polls}</div>
              <div className="stat-label">Draft</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total_votes}</div>
              <div className="stat-label">Total Votes</div>
            </div>
          </div>
        )}

        {stats?.most_voted_poll && (
          <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Most Voted Poll</p>
            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{stats.most_voted_poll.poll_title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {stats.most_voted_poll.total_votes} votes ·{' '}
              <Link to={`/analytics/${stats.most_voted_poll.poll_id}`} style={{ color: 'var(--primary)' }}>
                View Details
              </Link>
            </p>
          </div>
        )}

        <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>All Polls</h2>
        {polls.length === 0 && !error && (
          <p style={{ color: 'var(--text-muted)' }}>No polls found.</p>
        )}
        <div className="poll-grid">
          {polls.map(poll => (
            <div key={poll.poll_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className={`badge badge-${poll.poll_status.toLowerCase()}`}>{poll.poll_status}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>#{poll.poll_id}</span>
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>{poll.poll_title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}
              </p>
              <Link to={`/analytics/${poll.poll_id}`} className="btn btn-outline btn-sm">
                View Analytics
              </Link>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">© 2024 PollStream — Real-Time Polling Platform</footer>
    </div>
  );
}
