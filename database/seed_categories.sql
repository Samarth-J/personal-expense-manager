-- Seed predefined categories for Expense Tracker
-- Run this if categories are not automatically initialized

USE expense_tracker;

-- Insert predefined categories
INSERT INTO categories (name, type, user_id) VALUES
('Food & Dining', 'PREDEFINED', NULL),
('Transportation', 'PREDEFINED', NULL),
('Shopping', 'PREDEFINED', NULL),
('Entertainment', 'PREDEFINED', NULL),
('Bills & Utilities', 'PREDEFINED', NULL),
('Healthcare', 'PREDEFINED', NULL),
('Education', 'PREDEFINED', NULL),
('Travel', 'PREDEFINED', NULL),
('Groceries', 'PREDEFINED', NULL),
('Rent', 'PREDEFINED', NULL),
('Insurance', 'PREDEFINED', NULL),
('Salary', 'PREDEFINED', NULL),
('Investment', 'PREDEFINED', NULL),
('Other', 'PREDEFINED', NULL);

SELECT * FROM categories;
