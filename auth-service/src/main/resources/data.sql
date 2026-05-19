-- Seed default admin user (password: admin123)
-- BCrypt hash for 'admin123'
INSERT INTO users (username, email, password, role, created_at)
VALUES ('admin', 'admin@polling.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', NOW())
ON CONFLICT (username) DO NOTHING;
