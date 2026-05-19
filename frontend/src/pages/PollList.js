import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollApi, voteApi } from '../api/axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    pollApi.get('/polls/active')
      .then(res => {
        const activePolls = res.data;
        setPolls(activePolls);
        return Promise.all(
          activePolls.map(p =>
            voteApi.get(`/votes/results/${p.id}`)
              .then(r => ({ id: p.id, data: r.data }))
              .catch(() => ({ id: p.id, data: { results: {}, totalVotes: 0 } }))
          )
        );
      })
      .then(allResults => {
        const map = {};
        allResults.forEach(({ id, data }) => { map[id] = data; });
        setResults(map);
      })
      .catch(() => setError('Failed to load polls'))
      .finally(() => setLoading(false));
  }, []);

  const getPercent = (pollId, optionId) => {
    const r = results[pollId];
    if (!r || !r.totalVotes) return 0;
    return Math.round(((r.results[optionId] || 0) / r.totalVotes) * 100);
  };

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
          {polls.map(poll => {
            const r = results[poll.id];
            const totalVotes = r?.totalVotes || 0;
            return (
              <div key={poll.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-active">Active</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                  </span>
                </div>

                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1.05rem' }}>{poll.title}</h3>

                {poll.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    {poll.description}
                  </p>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  {poll.options.map(opt => {
                    const pct = getPercent(poll.id, opt.id);
                    return (
                      <div key={opt.id} style={{ marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                            {opt.optionText}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{pct}%</span>
                        </div>
                        <div style={{ height: '5px', borderRadius: '9999px', background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link to={`/poll/${poll.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Vote Now →
                </Link>
              </div>
            );
          })}
        </div>
      </main>
      <footer className="footer">© 2024 PollStream — Real-Time Polling Platform</footer>
    </div>
  );
}
