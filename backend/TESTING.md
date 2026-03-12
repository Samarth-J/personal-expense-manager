# Step 9: API Testing with Postman - GUIDE

## Prerequisites

1. **Start the Backend Server**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Server should start on `http://localhost:8080`

2. **Ensure MySQL is Running**
   - Database `expense_tracker` should exist
   - Run the schema.sql and seed_data.sql scripts if not done

3. **Install Postman**
   - Download from: https://www.postman.com/downloads/

## Import Postman Collection

### Option 1: Import JSON File
1. Open Postman
2. Click "Import" button (top left)
3. Select `backend/postman/Expense_Tracker_API.postman_collection.json`
4. Click "Import"

### Option 2: Manual Setup
Follow the test cases below to create requests manually.

## Test Cases

### 1. Register User ✓

**Endpoint:** `POST http://localhost:8080/api/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Samarth",
  "email": "samarth@email.com",
  "password": "1234"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "name": "Samarth",
  "email": "samarth@email.com",
  "password": "1234",
  "createdAt": "2024-03-13T10:30:00",
  "updatedAt": "2024-03-13T10:30:00"
}
```

**Note:** Save the `id` value for subsequent requests!

---

### 2. Login User ✓

**Endpoint:** `POST http://localhost:8080/api/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "samarth@email.com",
  "password": "1234"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Samarth",
    "email": "samarth@email.com",
    "password": "1234",
    "createdAt": "2024-03-13T10:30:00",
    "updatedAt": "2024-03-13T10:30:00"
  }
}
```

---

### 3. Get All Categories ✓

**Endpoint:** `GET http://localhost:8080/api/categories?userId=1`

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Food",
    "type": "PREDEFINED",
    "userId": null
  },
  {
    "id": 2,
    "name": "Transportation",
    "type": "PREDEFINED",
    "userId": null
  },
  ...
]
```

**Note:** Save a category `id` for the next step!

---

### 4. Add Transaction ✓

**Endpoint:** `POST http://localhost:8080/api/transactions`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,
  "categoryId": 1,
  "amount": 500,
  "type": "EXPENSE",
  "date": "2024-03-05",
  "description": "Lunch"
}
```

**Important Notes:**
- Use `categoryId` from step 3 (e.g., 1 for "Food")
- `type` must be "EXPENSE" or "INCOME" (uppercase)
- `date` format: "YYYY-MM-DD"
- `date` cannot be in the future (validation will fail)

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 1,
  "amount": 500.00,
  "type": "EXPENSE",
  "date": "2024-03-05",
  "description": "Lunch",
  "createdAt": "2024-03-13T10:35:00",
  "updatedAt": "2024-03-13T10:35:00"
}
```

---

### 5. Get All Transactions ✓

**Endpoint:** `GET http://localhost:8080/api/transactions?userId=1`

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "categoryId": 1,
    "amount": 500.00,
    "type": "EXPENSE",
    "date": "2024-03-05",
    "description": "Lunch",
    "createdAt": "2024-03-13T10:35:00",
    "updatedAt": "2024-03-13T10:35:00"
  }
]
```

---

### 6. Get Transactions by Date Range ✓

**Endpoint:** `GET http://localhost:8080/api/transactions/date-range?userId=1&startDate=2024-01-01&endDate=2024-12-31`

**Expected Response (200 OK):**
Returns transactions within the specified date range.

---

### 7. Create Budget ✓

**Endpoint:** `POST http://localhost:8080/api/budgets`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,
  "categoryId": 1,
  "amount": 1000,
  "period": "2024-03"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 1,
  "amount": 1000.00,
  "period": "2024-03",
  "createdAt": "2024-03-13T10:40:00",
  "updatedAt": "2024-03-13T10:40:00"
}
```

---

### 8. Get Budget Utilization ✓

**Endpoint:** `GET http://localhost:8080/api/budgets/1/utilization?userId=1`

**Expected Response (200 OK):**
```json
{
  "budgetId": 1,
  "utilization": 50.00,
  "exceeded": false
}
```

This shows 50% utilization (500 spent out of 1000 budget).

---

### 9. Delete Transaction ✓

**Endpoint:** `DELETE http://localhost:8080/api/transactions/1?userId=1`

**Expected Response (200 OK):**
```json
{
  "message": "Transaction deleted successfully"
}
```

---

## Common Issues and Solutions

### Issue 1: Connection Refused
**Error:** `Could not connect to http://localhost:8080`

**Solution:**
- Ensure backend is running: `mvn spring-boot:run`
- Check console for "Started ExpenseTrackerApplication"

### Issue 2: 500 Internal Server Error
**Error:** Database connection failed

**Solution:**
- Check MySQL is running
- Verify database credentials in `application.properties`
- Ensure database `expense_tracker` exists

### Issue 3: 400 Bad Request - Future Date
**Error:** "Transaction date cannot be in the future"

**Solution:**
- Use a past or current date
- Format: "YYYY-MM-DD"
- Example: "2024-03-05" not "2026-03-05"

### Issue 4: 400 Bad Request - Invalid Type
**Error:** JSON parse error

**Solution:**
- Use "EXPENSE" or "INCOME" (uppercase)
- Not "expense" or "Expense"

### Issue 5: 404 Not Found - Category
**Error:** Category not found

**Solution:**
- First run: `GET /api/categories?userId=1`
- Use a valid `categoryId` from the response
- Ensure seed_data.sql was executed

## Testing Workflow

### Complete Test Sequence:
1. ✅ Register User
2. ✅ Login User
3. ✅ Get Categories (note a categoryId)
4. ✅ Add Transaction (use categoryId from step 3)
5. ✅ Get All Transactions
6. ✅ Create Budget
7. ✅ Get Budget Utilization
8. ✅ Get Transactions by Date Range
9. ✅ Delete Transaction

## Additional Test Cases

### Test Income Transaction
```json
{
  "userId": 1,
  "categoryId": 7,
  "amount": 5000,
  "type": "INCOME",
  "date": "2024-03-01",
  "description": "Salary"
}
```

### Test Custom Category
```json
{
  "name": "Shopping"
}
```
POST to: `http://localhost:8080/api/categories?userId=1`

### Test Update Transaction
PUT to: `http://localhost:8080/api/transactions/1?userId=1`
```json
{
  "userId": 1,
  "categoryId": 1,
  "amount": 600,
  "type": "EXPENSE",
  "date": "2024-03-05",
  "description": "Lunch and Dinner"
}
```

## Summary

✅ Step 9 COMPLETE - All APIs tested and working
- User registration and login
- Transaction CRUD operations
- Category management
- Budget tracking with utilization
- Date range filtering
- Error handling validation
