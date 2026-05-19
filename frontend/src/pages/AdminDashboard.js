import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import CreatePollModal from '../components/CreatePollModal';

const STATUS_ACTIONS = {
  DRAFT:  { next: 'activate', label: 'Activate', btnClass: 'btn-success' },
  ACTIVE: { next: 'end',      label: 'End Poll',  btnClass: 'btn-danger'  },
  ENDED:  null,
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPolls = () => {
    setLoading(true);
    pollApi.get('/polls')
      .then(res => setPolls(res.data))
      .catch(() => setError('Failed to load polls'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPolls(); }, []);

  const handleStatusChange = async (poll) => {
    const action = STATUS_ACTIONS[poll.status];
    if (!action) return;
    setActionLoading(poll.id);
    try {
      await pollApi.put(`/polls/${poll.id}/${action.next}`);
      fetchPolls();
    } catch (err) {
      setError(`Failed to ${action.label.toLowerCase()}: ${err.response?.data?.message || 'unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this poll? This cannot be undone.')) return;
    try {
      await pollApi.delete(`/polls/${id}`);
      setPolls(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete poll');
    }
  };

  const handleCreated = (poll) => {
    setPolls(prev => [poll, ...prev]);
    setShowModal(false);
  };

  const stats = {
    total: polls.length,
    active: polls.filter(p => p.status === 'ACTIVE').length,
    draft: polls.filter(p => p.status === 'DRAFT').length,
    ended: polls.filter(p => p.status === 'ENDED').length,
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, <strong>{user?.username}</strong></p>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Polls</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.draft}</div>
            <div className="stat-label">Draft</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{stats.ended}</div>
            <div className="stat-label">Ended</div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="section-heading">
          <h2>All Polls</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Poll</button>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && polls.length === 0 && (
          <div className="empty-state">
            <h3>No polls yet</h3>
            <p>Create your first poll to get started.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(true)}>
              Create Poll
            </button>
          </div>
        )}

        <div className="poll-grid">
          {polls.map(poll => {
            const action = STATUS_ACTIONS[poll.status];
            return (
              <div key={poll.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className={`badge badge-${poll.status.toLowerCase()}`}>{poll.status}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>#{poll.id}</span>
                </div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '1rem' }}>{poll.title}</h3>
                {poll.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    {poll.description.length > 80 ? poll.description.slice(0, 80) + '...' : poll.description}
                  </p>
                )}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {poll.options.length} options · Created by {poll.createdBy}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {poll.status === 'ACTIVE' && (
                    <Link to={`/poll/${poll.id}`} className="btn btn-outline btn-sm">View</Link>
                  )}
                  {action && (
                    <button
                      className={`btn btn-sm ${action.btnClass}`}
                      onClick={() => handleStatusChange(poll)}
                      disabled={actionLoading === poll.id}
                    >
                      {actionLoading === poll.id ? '...' : action.label}
                    </button>
                  )}
                  <Link to={`/analytics/${poll.id}`} className="btn btn-outline btn-sm">Analytics</Link>
                  <button
                    className="btn btn-sm btn-outline"
                    style={{ marginLeft: 'auto', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    onClick={() => handleDelete(poll.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showModal && (
        <CreatePollModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}

      <footer className="footer">© 2024 PollStream — Real-Time Polling Platform</footer>
    </div>
  );
}
