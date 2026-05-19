import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analyticsApi } from '../api/axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444',
  '#ec4899', '#14b8a6', '#f97316', '#a855f7',
];

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsApi.get(`/analytics/polls/${id}`)
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (error || !data) return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="alert alert-error">{error || 'Poll not found'}</div>
      </div>
    </div>
  );

  const labels = data.options.map(o => o.option_text);
  const counts = data.options.map(o => o.vote_count);

  const chartData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: COLORS.slice(0, labels.length),
      borderWidth: 0,
    }],
  };

  const barData = {
    labels,
    datasets: [{
      label: 'Votes',
      data: counts,
      backgroundColor: COLORS.slice(0, labels.length),
      borderRadius: 6,
    }],
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span className={`badge badge-${data.poll_status.toLowerCase()}`}>{data.poll_status}</span>
        </div>
        <h1 className="page-title">{data.poll_title}</h1>
        <p className="page-subtitle">Analytics · {data.total_votes} total votes</p>

        <div className="stat-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value">{data.total_votes}</div>
            <div className="stat-label">Total Votes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.options.length}</div>
            <div className="stat-label">Options</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.options.reduce((a, b) => a.vote_count > b.vote_count ? a : b, {})?.option_text?.split(' ')[0] || '—'}</div>
            <div className="stat-label">Leading Option</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Distribution</h3>
            <div className="chart-container">
              <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Vote Counts</h3>
            <Bar data={barData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }} />
          </div>
        </div>

        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Detailed Breakdown</h3>
          {data.options.map((opt, i) => (
            <div key={opt.option_id} className="result-bar-wrap">
              <div className="result-bar-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[i], display: 'inline-block' }} />
                  {opt.option_text}
                </span>
                <span style={{ fontWeight: 600 }}>{opt.percentage}% ({opt.vote_count})</span>
              </div>
              <div className="result-bar-track">
                <div className="result-bar-fill" style={{ width: `${opt.percentage}%`, background: COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">© 2024 PollStream — Real-Time Polling Platform</footer>
    </div>
  );
}
