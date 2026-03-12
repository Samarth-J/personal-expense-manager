# Expense Tracker Backend

Spring Boot REST API for the Expense Tracker application.

## Prerequisites

- Java JDK 17 or above
- Maven 3.6+
- MySQL 8.0+
- IntelliJ IDEA or Eclipse (recommended)

## Dependencies

- Spring Boot 3.2.0
- Spring Web
- Spring Data JPA
- MySQL Connector
- Lombok
- Spring Validation

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/expensetracker/
│   │   │   ├── ExpenseTrackerApplication.java
│   │   │   ├── entity/
│   │   │   │   ├── User.java
│   │   │   │   ├── Transaction.java
│   │   │   │   ├── Category.java
│   │   │   │   └── Budget.java
│   │   │   └── repository/
│   │   │       ├── UserRepository.java
│   │   │       ├── TransactionRepository.java
│   │   │       ├── CategoryRepository.java
│   │   │       └── BudgetRepository.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Setup Instructions

### 1. Configure Database

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Build the Project

```bash
cd backend
mvn clean install
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Entity Models

### User
- id (Long)
- name (String)
- email (String, unique)
- password (String)
- createdAt, updatedAt (LocalDateTime)

### Transaction
- id (Long)
- userId (Long)
- categoryId (Long)
- amount (BigDecimal)
- type (INCOME/EXPENSE)
- date (LocalDate)
- description (String)
- createdAt, updatedAt (LocalDateTime)

### Category
- id (Long)
- name (String)
- type (PREDEFINED/CUSTOM)
- userId (Long, nullable)

### Budget
- id (Long)
- userId (Long)
- categoryId (Long)
- amount (BigDecimal)
- period (String, YYYY-MM format)
- createdAt, updatedAt (LocalDateTime)

## Next Steps

1. Implement Service layer
2. Implement Controller layer
3. Add authentication and security
4. Add validation
5. Add exception handling
6. Write unit tests

## Testing

Run tests with:

```bash
mvn test
```

## Build for Production

```bash
mvn clean package
java -jar target/expense-tracker-backend-1.0.0.jar
```
