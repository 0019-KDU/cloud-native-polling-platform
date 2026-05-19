import axios from 'axios';

const AUTH_URL   = process.env.REACT_APP_AUTH_SERVICE_URL   || 'http://localhost:8081';
const POLL_URL   = process.env.REACT_APP_POLL_SERVICE_URL   || 'http://localhost:8082';
const VOTE_URL   = process.env.REACT_APP_VOTE_SERVICE_URL   || 'http://localhost:8083';
const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_SERVICE_URL || 'http://localhost:8084';

function createClient(baseURL) {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const isLoginRequest = err.config?.url?.includes('/auth/login');
      if (err.response?.status === 401 && !isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );

  return client;
}

export const authApi      = createClient(`${AUTH_URL}/api`);
export const pollApi      = createClient(`${POLL_URL}/api`);
export const voteApi      = createClient(`${VOTE_URL}/api`);
export const analyticsApi = createClient(`${ANALYTICS_URL}/api`);
