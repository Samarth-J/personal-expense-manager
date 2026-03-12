# Step 5: Entity Classes - COMPLETED ✓

## Overview

Entity classes represent database tables and are already created with enhanced features using JPA annotations and Lombok.

## Created Entity Classes

### 1. User.java ✓

**Location:** `src/main/java/com/expensetracker/entity/User.java`

**Fields:**
- `id` (Long) - Primary key, auto-generated
- `name` (String) - User's full name
- `email` (String) - Unique email address
- `password` (String) - Hashed password
- `createdAt` (LocalDateTime) - Auto-generated timestamp
- `updatedAt` (LocalDateTime) - Auto-updated timestamp

**Annotations:**
- `@Entity` - Marks as JPA entity
- `@Table(name = "users")` - Maps to users table
- `@Data` - Lombok: generates getters, setters, toString, equals, hashCode
- `@NoArgsConstructor` - Lombok: generates no-args constructor
- `@AllArgsConstructor` - Lombok: generates all-args constructor
- `@Id` - Primary key
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` - Auto-increment
- `@Column` - Column constraints (nullable, unique, length)
- `@CreationTimestamp` - Auto-set on creation
- `@UpdateTimestamp` - Auto-update on modification

**Example Usage:**
```java
User user = new User();
user.setName("John Doe");
user.setEmail("john@example.com");
user.setPassword("hashedPassword");
// createdAt and updatedAt are automatically set
```

### 2. Transaction.java ✓

**Location:** `src/main/java/com/expensetracker/entity/Transaction.java`

**Fields:**
- `id` (Long) - Primary key, auto-generated
- `userId` (Long) - Foreign key to User
- `categoryId` (Long) - Foreign key to Category
- `amount` (BigDecimal) - Transaction amount (precise decimal)
- `type` (TransactionType enum) - INCOME or EXPENSE
- `date` (LocalDate) - Transaction date
- `description` (String) - Transaction description
- `createdAt` (LocalDateTime) - Auto-generated timestamp
- `updatedAt` (LocalDateTime) - Auto-updated timestamp

**Enum:**
```java
public enum TransactionType {
    INCOME,
    EXPENSE
}
```

**Annotations:**
- `@Entity` - Marks as JPA entity
- `@Table(name = "transactions")` - Maps to transactions table
- `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` - Lombok annotations
- `@Enumerated(EnumType.STRING)` - Stores enum as string in database
- `@Column` - Column constraints and mappings

**Example Usage:**
```java
Transaction transaction = new Transaction();
transaction.setUserId(1L);
transaction.setCategoryId(2L);
transaction.setAmount(new BigDecimal("150.50"));
transaction.setType(Transaction.TransactionType.EXPENSE);
transaction.setDate(LocalDate.now());
transaction.setDescription("Grocery shopping");
```

### 3. Category.java ✓

**Location:** `src/main/java/com/expensetracker/entity/Category.java`

**Fields:**
- `id` (Long) - Primary key
- `name` (String) - Category name
- `type` (CategoryType enum) - PREDEFINED or CUSTOM
- `userId` (Long) - Owner user ID (null for predefined)

**Enum:**
```java
public enum CategoryType {
    PREDEFINED,
    CUSTOM
}
```

### 4. Budget.java ✓

**Location:** `src/main/java/com/expensetracker/entity/Budget.java`

**Fields:**
- `id` (Long) - Primary key
- `userId` (Long) - Foreign key to User
- `categoryId` (Long) - Foreign key to Category
- `amount` (BigDecimal) - Budget limit
- `period` (String) - Budget period (YYYY-MM format)
- `createdAt`, `updatedAt` (LocalDateTime) - Timestamps

**Unique Constraint:**
- Combination of (userId, categoryId, period) must be unique

## Enhancements Over Basic Implementation

### 1. Better Data Types
- ✓ `Long` instead of `int` for IDs (supports larger datasets)
- ✓ `BigDecimal` instead of `double` for amounts (precise decimal calculations)
- ✓ `LocalDate` instead of `Date` (modern Java 8+ date API)
- ✓ `LocalDateTime` for timestamps

### 2. Lombok Integration
- ✓ `@Data` - Auto-generates getters, setters, toString, equals, hashCode
- ✓ `@NoArgsConstructor` - Required by JPA
- ✓ `@AllArgsConstructor` - Convenient for testing
- ✓ Reduces boilerplate code significantly

### 3. Automatic Timestamps
- ✓ `@CreationTimestamp` - Auto-set when entity is created
- ✓ `@UpdateTimestamp` - Auto-update when entity is modified
- ✓ Useful for audit trails

### 4. Column Constraints
- ✓ `nullable = false` - Enforces NOT NULL at JPA level
- ✓ `unique = true` - Enforces uniqueness (e.g., email)
- ✓ `length` - Specifies column length
- ✓ `precision` and `scale` - For decimal numbers

### 5. Enum Types
- ✓ Type-safe transaction types (INCOME/EXPENSE)
- ✓ Type-safe category types (PREDEFINED/CUSTOM)
- ✓ Stored as strings in database for readability

### 6. Table Mapping
- ✓ `@Table(name = "...")` - Explicit table name mapping
- ✓ `@Column(name = "...")` - Explicit column name mapping (snake_case)
- ✓ Follows database naming conventions

## Comparison: Basic vs Enhanced

### Basic Implementation (from guide):
```java
@Entity
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String email;
    private String password;
    // Need to manually write getters, setters, constructors
}
```

### Enhanced Implementation (our version):
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // Getters, setters, constructors auto-generated by Lombok
}
```

## Benefits of Enhanced Implementation

1. **Type Safety** - Enums prevent invalid values
2. **Precision** - BigDecimal for accurate money calculations
3. **Less Code** - Lombok reduces boilerplate by ~70%
4. **Audit Trail** - Automatic timestamps for tracking
5. **Validation** - Column constraints at entity level
6. **Modern Java** - Uses Java 8+ date/time API
7. **Maintainability** - Clear, self-documenting code
8. **Database Alignment** - Matches database schema exactly

## Testing the Entities

Run the application to verify entities are correctly mapped:

```bash
cd backend
mvn spring-boot:run
```

Check the console for:
- ✓ No entity mapping errors
- ✓ Hibernate validates schema successfully
- ✓ Tables are created/updated (if ddl-auto=update)

## Next Steps

With entities complete, you can now:
1. Create Service layer (business logic)
2. Create Controller layer (REST endpoints)
3. Add validation annotations
4. Implement authentication
5. Write unit tests

## Summary

✅ **Step 5 is COMPLETE** with enhanced features:
- User entity with all required fields
- Transaction entity with precise amount handling
- Category entity for organization
- Budget entity for spending limits
- Lombok integration for clean code
- Automatic timestamps for audit trails
- Type-safe enums for data integrity
- Column constraints for validation
