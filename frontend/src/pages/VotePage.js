import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { pollApi, voteApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const REALTIME_URL = process.env.REACT_APP_REALTIME_SERVICE_URL || 'http://localhost:3001';

export default function VotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const pollId = parseInt(id, 10);

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    Promise.all([
      pollApi.get(`/polls/${pollId}`),
      voteApi.get(`/votes/results/${pollId}`),
    ])
      .then(([pollRes, resultsRes]) => {
        setPoll(pollRes.data);
        setResults(resultsRes.data.results || {});
        setTotalVotes(resultsRes.data.totalVotes || 0);
      })
      .catch(() => setError('Failed to load poll'))
      .finally(() => setLoading(false));

    const socket = io(REALTIME_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join:poll', pollId);
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('vote:update', ({ results: r, totalVotes: t }) => {
      setResults(r);
      setTotalVotes(t);
    });
    socket.on('participants:update', ({ count }) => {
      setParticipants(count);
    });

    return () => {
      socket.emit('leave:poll', pollId);
      socket.disconnect();
    };
  }, [pollId]);

  const handleVote = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError('');
    try {
      await voteApi.post('/votes', { pollId, optionId: parseInt(selected, 10) });
      setHasVoted(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setHasVoted(true);
        setError('You have already voted in this poll.');
      } else {
        setError(err.response?.data?.message || 'Vote failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getPercent = (optionId) => {
    if (!totalVotes) return 0;
    return Math.round(((results[optionId] || 0) / totalVotes) * 100);
  };

  if (loading) return <><Navbar /><LoadingSpinner /></>;

  if (!poll) return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="alert alert-error">Poll not found.</div>
        <button className="btn btn-outline" onClick={() => navigate('/')}>Back to Polls</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '700px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className={`badge badge-${poll.status.toLowerCase()}`}>{poll.status}</span>
          {connected && (
            <span className="live-badge"><span className="live-dot" /> Live</span>
          )}
          {connected && participants > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              {participants} watching
            </span>
          )}
        </div>
        <h1 className="page-title">{poll.title}</h1>
        {poll.description && (
          <p className="page-subtitle">{poll.description}</p>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {isAdmin ? (
          <div className="alert" style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            Admins cannot vote on polls. You can view live results below.
          </div>
        ) : !hasVoted && poll.status === 'ACTIVE' ? (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Cast Your Vote</h3>
            {poll.options.map(opt => (
              <label key={opt.id} className={`option-row${selected == opt.id ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="option"
                  value={opt.id}
                  checked={selected == opt.id}
                  onChange={() => setSelected(opt.id)}
                />
                <span style={{ flex: 1 }}>{opt.optionText}</span>
              </label>
            ))}
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
              disabled={!selected || submitting}
              onClick={handleVote}
            >
              {submitting ? 'Submitting...' : 'Submit Vote'}
            </button>
          </div>
        ) : (
          hasVoted && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              ✓ Your vote has been recorded!
            </div>
          )
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 600 }}>Live Results</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </span>
          </div>
          {poll.options.map(opt => (
            <div key={opt.id} className="result-bar-wrap">
              <div className="result-bar-label">
                <span>{opt.optionText}</span>
                <span style={{ fontWeight: 600 }}>{getPercent(opt.id)}% ({results[opt.id] || 0})</span>
              </div>
              <div className="result-bar-track">
                <div className="result-bar-fill" style={{ width: `${getPercent(opt.id)}%` }} />
              </div>
            </div>
          ))}
          {totalVotes === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
              No votes yet — be the first!
            </p>
          )}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => navigate('/')}>← Back to Polls</button>
        </div>
      </main>
      <footer className="footer">© 2024 PollStream — Real-Time Polling Platform</footer>
    </div>
  );
}
