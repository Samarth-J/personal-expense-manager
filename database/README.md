# Database Setup Guide

## Prerequisites
- MySQL 8.0 or above installed
- MySQL server running

## Step 1: Access MySQL

Open your terminal or command prompt and access MySQL:

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

## Step 2: Create Database and Tables

Run the schema script:

```bash
mysql -u root -p < database/schema.sql
```

Or manually execute the SQL commands:

```sql
source database/schema.sql;
```

## Step 3: Insert Predefined Categories

Run the seed data script:

```bash
mysql -u root -p expense_tracker < database/seed_data.sql
```

Or manually:

```sql
source database/seed_data.sql;
```

## Database Schema Overview

### Tables Created:

1. **users** - Stores user account information
   - id (Primary Key)
   - name
   - email (Unique)
   - password (Hashed)
   - created_at, updated_at

2. **categories** - Stores transaction categories
   - id (Primary Key)
   - name
   - type (PREDEFINED or CUSTOM)
   - user_id (Foreign Key, nullable for predefined)

3. **transactions** - Stores income and expense records
   - id (Primary Key)
   - user_id (Foreign Key)
   - category_id (Foreign Key)
   - amount (Decimal)
   - type (INCOME or EXPENSE)
   - date
   - description
   - created_at, updated_at

4. **budgets** - Stores monthly budget limits
   - id (Primary Key)
   - user_id (Foreign Key)
   - category_id (Foreign Key)
   - amount (Decimal)
   - period (YYYY-MM format)
   - created_at, updated_at

5. **sessions** - Stores user authentication sessions
   - token (Primary Key)
   - user_id (Foreign Key)
   - created_at
   - expires_at

## Verify Installation

Check if tables were created successfully:

```sql
USE expense_tracker;
SHOW TABLES;
```

Check predefined categories:

```sql
SELECT * FROM categories;
```

## Database Configuration

Update your application configuration with these database credentials:

```properties
# application.properties (Spring Boot)
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
```

## Troubleshooting

If you encounter permission issues, create a dedicated database user:

```sql
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;
```
