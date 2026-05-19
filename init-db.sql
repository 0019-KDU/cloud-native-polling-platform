-- Create tables for the polling platform
-- Spring Boot / Hibernate will manage schema via DDL auto, but this seeds initial admin

-- This script runs once on first DB init via Docker
-- Tables are created by Spring Boot JPA (ddl-auto=update)
-- We insert the default admin after tables are ready via Spring Boot data.sql

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE pollingdb TO polluser;
