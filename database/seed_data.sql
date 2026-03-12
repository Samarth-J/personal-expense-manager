-- Seed Data for Expense Tracker
USE expense_tracker;

-- Insert Predefined Categories
INSERT INTO categories (name, type, user_id) VALUES
('Food', 'PREDEFINED', NULL),
('Transportation', 'PREDEFINED', NULL),
('Housing', 'PREDEFINED', NULL),
('Utilities', 'PREDEFINED', NULL),
('Entertainment', 'PREDEFINED', NULL),
('Healthcare', 'PREDEFINED', NULL),
('Income', 'PREDEFINED', NULL),
('Other', 'PREDEFINED', NULL);
