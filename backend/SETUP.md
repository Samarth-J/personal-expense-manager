# Backend Setup Guide - Step 4: Database Configuration

## Database Connection Configuration

The application is configured to connect to MySQL database. Follow these steps:

### 1. Update Database Credentials

Open `src/main/resources/application.properties` and update with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=yourpassword
```

**Important:** Replace `yourpassword` with your actual MySQL root password.

### 2. Configuration Explained

```properties
# Database URL - points to expense_tracker database on localhost
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker

# MySQL username (default: root)
spring.datasource.username=root

# MySQL password (update this!)
spring.datasource.password=yourpassword

# MySQL driver class
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate DDL mode - 'update' will auto-create/update tables
spring.jpa.hibernate.ddl-auto=update

# Show SQL queries in console (useful for debugging)
spring.jpa.show-sql=true

# MySQL dialect for Hibernate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Format SQL output for readability
spring.jpa.properties.hibernate.format_sql=true
```

### 3. DDL Auto Options

The `spring.jpa.hibernate.ddl-auto` property has several options:

- **update** (current): Creates tables if they don't exist, updates existing ones
- **create**: Drops and recreates tables on each startup (data loss!)
- **create-drop**: Creates tables on startup, drops on shutdown
- **validate**: Only validates schema, doesn't make changes
- **none**: No schema management

For development, `update` is recommended. For production, use `validate` or `none`.

### 4. Verify Database Connection

Before running the application, ensure:

1. MySQL server is running
2. Database `expense_tracker` exists (run the schema.sql script)
3. MySQL credentials are correct

### 5. Test the Connection

Run the application:

```bash
cd backend
mvn spring-boot:run
```

If successful, you should see:
- "Started ExpenseTrackerApplication" message
- No connection errors
- SQL statements in the console (if show-sql=true)

### 6. Common Issues

**Connection refused:**
- Check if MySQL is running: `mysql -u root -p`
- Verify port 3306 is not blocked

**Access denied:**
- Verify username and password
- Check user permissions: `GRANT ALL PRIVILEGES ON expense_tracker.* TO 'root'@'localhost';`

**Database not found:**
- Create database: `CREATE DATABASE expense_tracker;`
- Or run the schema.sql script

**Timezone issues:**
- Add to URL: `?serverTimezone=UTC`
- Example: `jdbc:mysql://localhost:3306/expense_tracker?serverTimezone=UTC`

### 7. Security Note

**Never commit passwords to Git!**

The `application.properties` file contains sensitive information. Consider:

1. Using environment variables:
```properties
spring.datasource.password=${DB_PASSWORD}
```

2. Using application-local.properties (gitignored):
```bash
cp application.properties application-local.properties
# Edit application-local.properties with real credentials
```

3. Using Spring profiles for different environments
