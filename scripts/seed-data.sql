-- Seed data for TalentScout Kenya platform
-- This script populates the database with sample data for testing and demonstration

-- Insert sample users (players, scouts, parents)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, county, date_of_birth, role, is_verified) VALUES
-- Players
('550e8400-e29b-41d4-a716-446655440001', 'john.kamau@email.com', '$2a$10$example_hash_1', 'John', 'Kamau', '+254701234567', 'Nairobi', '2007-03-15', 'player', true),
('550e8400-e29b-41d4-a716-446655440002', 'mary.wanjiku@email.com', '$2a$10$example_hash_2', 'Mary', 'Wanjiku', '+254702345678', 'Kiambu', '2008-07-22', 'player', true),
('550e8400-e29b-41d4-a716-446655440003', 'david.ochieng@email.com', '$2a$10$example_hash_3', 'David', 'Ochieng', '+254703456789', 'Kisumu', '2006-11-08', 'player', true),
('550e8400-e29b-41d4-a716-446655440004', 'grace.muthoni@email.com', '$2a$10$example_hash_4', 'Grace', 'Muthoni', '+254704567890', 'Nyeri', '2007-05-12', 'player', true),
('550e8400-e29b-41d4-a716-446655440005', 'peter.kipchoge@email.com', '$2a$10$example_hash_5', 'Peter', 'Kipchoge', '+254705678901', 'Nandi', '2005-09-03', 'player', true),

-- Scouts
('550e8400-e29b-41d4-a716-446655440010', 'james.mwangi@scout.com', '$2a$10$example_hash_10', 'James', 'Mwangi', '+254710123456', 'Nairobi', '1985-04-20', 'scout', true),
('550e8400-e29b-41d4-a716-446655440011', 'mary.njeri@scout.com', '$2a$10$example_hash_11', 'Mary', 'Njeri', '+254711234567', 'Mombasa', '1982-08-15', 'scout', true),
('550e8400-e29b-41d4-a716-446655440012', 'peter.ouma@scout.com', '$2a$10$example_hash_12', 'Peter', 'Ouma', '+254712345678', 'Kisumu', '1988-12-10', 'scout', true),

-- Parents
('550e8400-e29b-41d4-a716-446655440020', 'parent.kamau@email.com', '$2a$10$example_hash_20', 'Samuel', 'Kamau', '+254720123456', 'Nairobi', '1975-06-25', 'parent', true),
('550e8400-e29b-41d4-a716-446655440021', 'parent.wanjiku@email.com', '$2a$10$example_hash_21', 'Jane', 'Wanjiku', '+254721234567', 'Kiambu', '1978-03-18', 'parent', true);

-- Insert players data
INSERT INTO players (id, sport, position, bio, ai_score, height_cm, weight_kg, parent_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Football', 'Midfielder', 'Passionate midfielder with excellent ball control and vision. Started playing at age 8 in local youth leagues.', 87.5, 175,
