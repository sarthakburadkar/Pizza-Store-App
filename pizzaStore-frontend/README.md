# 🍕 Pizza Store Full-Stack Application

A distributed full-stack system for managing pizza orders, featuring a **Spring Boot** microservices backend and a **React** frontend.

---

## 📝 Project Overview
This project simulates a real-world pizza ordering platform. It is built using a **Microservices Architecture**, which allows different parts of the application (like Authentication and User Management) to run independently. All communication between the frontend and backend is managed through a centralized API Gateway.

### Core Technologies
* **Frontend:** React.js (Vite), Axios, CSS3
* **Backend:** Java 17, Spring Boot, Spring Data JPA
* **Microservices Infrastructure:** Netflix Eureka (Service Registry), Spring Cloud Gateway
* **Security:** JWT (JSON Web Tokens) for secure API access
* **Database:** MySQL

---

## 🚀 How to Run the Project

To run this project locally, follow these steps in order:

### 1. Prerequisites
* **Java JDK 17** or higher
* **Node.js** (v18 or higher)
* **Maven** (to build the Java projects)
* **MySQL Server** running on your local machine

### 2. Start the Backend (Order Matters!)
Open a terminal for each of these folders inside `pizzaStore-backend` and run the command:

1.  **eureka-server:** `mvn spring-boot:run` (Wait for this to start first)
2.  **authentication:** `mvn spring-boot:run`
3.  **API-Gateway:** `mvn spring-boot:run`
4.  **UserService:** `mvn spring-boot:run`
5.  **AdminService** `mvn spring-boot:run`

### 3. Start the Frontend
1.  Navigate to the `pizzaStore-frontend` directory.
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm run dev
    ```
4.  Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

---

## 🛠️ Key Technical Features
* **Microservices Communication:** Uses Eureka for service discovery.
* **Centralized Security:** JWT-based authentication implemented at the gateway/service level.
* **Global Error Handling:** Custom `GlobalExceptionHandler` to ensure the API always returns readable error messages.
* **Responsive UI:** A React-based frontend designed for a smooth user experience.
