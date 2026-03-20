# Running the Expense Tracker Application

## Prerequisites Checklist

Before running the application, ensure you have:

- ✅ Java JDK 17 or above installed
- ✅ Maven installed
- ✅ Node.js installed
- ✅ MySQL server running
- ✅ Database `expense_tracker` created
- ✅ Database schema and seed data loaded

## Quick Start Guide

### Step 1: Start MySQL Database

Ensure MySQL is running and the database is set up:

```bash
# Check if MySQL is running
mysql -u root -p

# If not set up, run these commands:
mysql -u root -p < database/schema.sql
mysql -u root -p expense_tracker < database/seed_data.sql
```

### Step 2: Start Backend Server

Open a new terminal (Terminal 1):

```bash
cd backend
mvn spring-boot:run
```

**Expected Output:**
```
Started ExpenseTrackerApplication in X.XXX seconds
```

Backend will run on: **http://localhost:8080**

### Step 3: Start Frontend Server

Open another terminal (Terminal 2):

```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

Frontend will automatically open at: **http://localhost:3000**

## Testing the Application

### 1. Register a New User
- Open http://localhost:3000
- Click "Register here"
- Fill in:
  - Name: Your Name
  - Email: your@email.com
  - Password: (any password)
- Click "Register"

### 2. Login
- Enter your email and password
- Click "Login"
- You should see the Dashboard

### 3. Add a Transaction
- Click "+ Add Transaction" button
- Fill in:
  - Type: Expense or Income
  - Amount: e.g., 50.00
  - Category: Select from dropdown
  - Date: Select date
  - Description: e.g., "Lunch"
- Click "Add Transaction"

### 4. View Dashboard
- See statistics cards (Income, Expense, Balance)
- View charts (Pie chart and Bar chart)
- See budget tracker (if budgets exist)
- View transaction list

### 5. Delete a Transaction
- Click the 🗑️ icon on any transaction
- Confirm deletion
- Dashboard updates automatically

## Troubleshooting

### Backend Issues

**Issue: Port 8080 already in use**
```
Error: Port 8080 is already in use
```
**Solution:** Stop other applications using port 8080 or change the port in `application.properties`

**Issue: Database connection failed**
```
Error: Could not connect to database
```
**Solution:** 
- Check MySQL is running
- Verify credentials in `backend/src/main/resources/application.properties`
- Ensure database `expense_tracker` exists

**Issue: Table doesn't exist**
```
Error: Table 'expense_tracker.users' doesn't exist
```
**Solution:** Run the schema.sql script:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p expense_tracker < database/seed_data.sql
```

### Frontend Issues

**Issue: Port 3000 already in use**
```
Something is already running on port 3000
```
**Solution:** 
- Stop other applications using port 3000
- Or run on different port: `PORT=3001 npm start`

**Issue: Module not found**
```
Error: Cannot find module 'axios'
```
**Solution:** Install dependencies:
```bash
cd frontend
npm install
```

**Issue: CORS error**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** 
- Ensure backend is running
- Check `@CrossOrigin(origins = "*")` is on controllers

**Issue: Network Error**
```
Error: Network Error
```
**Solution:**
- Ensure backend is running on port 8080
- Check backend console for errors
- Verify API_BASE_URL in `frontend/src/services/api.js`

## Stopping the Application

### Stop Backend
In Terminal 1, press: `Ctrl + C`

### Stop Frontend
In Terminal 2, press: `Ctrl + C`

### Stop MySQL (if needed)
```bash
# Windows
net stop MySQL80

# Linux/Mac
sudo service mysql stop
```

## Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Database:** localhost:3306

## API Endpoints

Test backend directly:

- **Register:** POST http://localhost:8080/api/users/register
- **Login:** POST http://localhost:8080/api/users/login
- **Transactions:** GET http://localhost:8080/api/transactions?userId=1
- **Categories:** GET http://localhost:8080/api/categories?userId=1

## Development Tips

### Hot Reload
- Frontend: Changes auto-reload in browser
- Backend: Restart required for code changes

### View Logs
- Backend: Check terminal output
- Frontend: Check browser console (F12)
- Database: Check MySQL logs

### Clear Data
To start fresh:
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE expense_tracker;
CREATE DATABASE expense_tracker;
exit

# Reload schema
mysql -u root -p < database/schema.sql
mysql -u root -p expense_tracker < database/seed_data.sql
```

## Production Deployment

For production deployment:

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Package backend:
```bash
cd backend
mvn clean package
```

3. Run backend JAR:
```bash
java -jar target/expense-tracker-backend-1.0.0.jar
```

4. Serve frontend build folder with a web server (nginx, Apache, etc.)

## Summary

✅ **To run the complete application:**

**Terminal 1 (Backend):**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

**Browser:**
Open http://localhost:3000

Enjoy your Expense Tracker! 💰📊
