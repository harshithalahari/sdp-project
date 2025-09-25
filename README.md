# 🚀 Role-Based Food Delivery Application

A full-stack food delivery application with JWT authentication and role-based access control.

## 🔑 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access (USER/CUSTOMER and ADMIN)
- Secure password encryption
- CSRF protection

### User Features
- Browse food items
- Add/remove items from cart
- Place orders
- View order history
- Profile management

### Admin Features
- CRUD operations for food items
- View all orders
- Update order status
- User management

## ⚙️ Tech Stack

### Backend
- **Spring Boot 3.5.5** with Java 21
- **Spring Security** with JWT
- **Spring Data JPA**
- **H2 Database** (development) / **MySQL** (production)
- **Maven** for dependency management

### Frontend
- **React 18.3.1**
- **React Router DOM** for navigation
- **Axios** for API calls
- **CSRF protection**

## 📂 Project Structure

```
harshitha-project/
├── fooddeliverysystem/fooddelivery/     # Spring Boot Backend
│   ├── src/main/java/com/example/fooddelivery/
│   │   ├── controller/                  # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java      # User APIs
│   │   │   └── AdminController.java     # Admin APIs
│   │   ├── model/                       # JPA Entities
│   │   ├── repository/                  # Data Repositories
│   │   ├── security/                    # JWT Security
│   │   └── config/                      # Configuration
│   └── pom.xml
└── fooddelivery-frontend/fooddelivery-frontend/  # React Frontend
    ├── src/
    │   ├── components/                  # React Components
    │   ├── api/                         # API Client
    │   └── utils/                       # Utilities
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 16+
- Maven 3.6+

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd fooddeliverysystem/fooddelivery
   ```

2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

3. Backend will start on `http://localhost:8082`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd fooddelivery-frontend/fooddelivery-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Frontend will start on `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user/admin
- `POST /api/auth/login` - Login & return JWT

### User APIs
- `GET /api/user/food` - Get available food items
- `POST /api/user/order` - Place order
- `GET /api/user/orders/{customerId}` - View user's orders

### Admin APIs
- `POST /api/admin/food` - Add new food item
- `PUT /api/admin/food/{id}` - Update food item
- `DELETE /api/admin/food/{id}` - Delete food item
- `GET /api/admin/orders` - View all orders
- `PUT /api/admin/orders/{id}` - Update order status

## 👥 Default Users

### Admin User
- **Phone:** 1234567890
- **Password:** admin123
- **Role:** ADMIN

### Customer User
- **Phone:** 9876543210
- **Password:** customer123
- **Role:** CUSTOMER

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- CSRF protection
- Password encryption with BCrypt
- Secure HTTP headers
- Input validation

## 🗄️ Database

### Development
- H2 in-memory database
- Console available at: `http://localhost:8082/h2-console`
- JDBC URL: `jdbc:h2:mem:food_delivery`
- Username: `sa`
- Password: (empty)

### Production
- MySQL support configured
- Update `application.properties` for production database

## 🛠️ Development

### Adding New Features
1. Backend: Add controllers in `controller/` package
2. Frontend: Add components in `src/components/`
3. Follow existing patterns for consistency

### Testing
- Backend: `mvn test`
- Frontend: `npm test`

## 📝 License

This project is licensed under the MIT License.