const Redis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redispass';

const VOTE_CHANNEL = 'vote:updates';

function createRedisClient(name) {
  const client = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    retryStrategy(times) {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    lazyConnect: false,
  });

  client.on('connect', () => console.log(`[Redis:${name}] Connected to ${REDIS_HOST}:${REDIS_PORT}`));
  client.on('error', (err) => console.error(`[Redis:${name}] Error:`, err.message));
  client.on('reconnecting', () => console.log(`[Redis:${name}] Reconnecting...`));

  return client;
}

module.exports = { createRedisClient, VOTE_CHANNEL };
