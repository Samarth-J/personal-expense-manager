# JWT Authentication Implementation

## Overview
This document describes the JWT (JSON Web Token) authentication system implemented in the Expense Tracker application.

## Components

### 1. Security Configuration (`SecurityConfig.java`)
- Configures Spring Security with JWT authentication
- Permits `/api/users/register` and `/api/users/login` without authentication
- All other endpoints require valid JWT token
- Enables CORS for frontend communication
- Uses BCrypt password encoding

### 2. JWT Utility (`JwtUtil.java`)
- Generates JWT tokens with 24-hour expiration
- Validates JWT tokens
- Extracts username (email) from tokens
- Uses HS256 algorithm for signing

### 3. JWT Authentication Filter (`JwtAuthenticationFilter.java`)
- Intercepts all HTTP requests
- Extracts JWT token from Authorization header
- Validates token and sets authentication in SecurityContext
- Runs before UsernamePasswordAuthenticationFilter

### 4. Custom UserDetailsService (`CustomUserDetailsService.java`)
- Loads user details from database by email
- Required by Spring Security for authentication

### 5. Auth Controller (`AuthController.java`)
- Handles `/api/users/register` - User registration with JWT token generation
- Handles `/api/users/login` - User login with JWT token generation
- Returns JWT token and user details (without password)

## API Endpoints

### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-03-13T10:00:00",
    "updatedAt": "2024-03-13T10:00:00"
  }
}
```

### Login User
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-03-13T10:00:00",
    "updatedAt": "2024-03-13T10:00:00"
  }
}
```

### Protected Endpoints
All other endpoints require JWT token in Authorization header:
```
GET /api/transactions?userId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Frontend Integration

### 1. Store JWT Token
After successful login/register, store the token in localStorage:
```javascript
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### 2. Add Token to API Requests
Update `frontend/src/services/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Update Login/Register Components
```javascript
// Login
const response = await userAPI.login(credentials);
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Register
const response = await userAPI.register(userData);
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

## Security Features

1. **Password Hashing**: Passwords are hashed using BCrypt before storing
2. **Token Expiration**: JWT tokens expire after 24 hours
3. **Stateless Authentication**: No session storage on server
4. **CORS Protection**: Only allows requests from http://localhost:3000
5. **Protected Routes**: All transaction/budget APIs require authentication

## Configuration

### JWT Secret Key
Located in `application.properties`:
```properties
jwt.secret=mySecretKeyForJWTTokenGenerationExpenseTrackerApplication2024SecureKey
jwt.expiration=86400000
```

**Important**: Change the secret key in production!

## Testing with Postman

### 1. Register/Login
- Send POST request to `/api/users/register` or `/api/users/login`
- Copy the `token` from response

### 2. Access Protected Endpoints
- Add header: `Authorization: Bearer <your-token>`
- Send requests to protected endpoints

## Dependencies Added

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

## Troubleshooting

### 401 Unauthorized
- Check if token is included in Authorization header
- Verify token format: `Bearer <token>`
- Check if token has expired

### 403 Forbidden
- Endpoint might not be configured in SecurityConfig
- Check CORS configuration

### Token Validation Failed
- Token might be expired
- Secret key mismatch
- Token format incorrect
