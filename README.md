# Project Management System

## About the Project

This is a comprehensive project management web application built with Spring Boot and React. It allows teams to effectively manage projects, milestones, and tasks to streamline workflow and enhance collaboration.

### Key Features

- **User Management**: Register, authenticate, and manage user profiles with both traditional login and OAuth2 integration (Google) 
- **Project Management**: Create, view, and manage multiple projects
- **Milestone Tracking**: Define and monitor project milestones for better progress tracking
- **Task Management**: Create, assign, and track tasks within projects
- **Responsive UI**: Modern React frontend with a responsive design

### Technology Stack

**Backend:**
- Java Spring Boot
- Spring Security with OAuth2
- JPA/Hibernate
- PostgreSQL Database
- RESTful API architecture

**Frontend:**
- React with TypeScript
- React Router for navigation
- Context API for state management
- Lazy loading for performance optimization
- Modern CSS styling

## How to Run the Application

### Backend (Spring Boot)

1. Navigate to the project root directory
2. Run the Spring Boot application using Gradle:

   ```
   ./gradlew bootRun
   ```

The backend server will start on port 8080 (default Spring Boot port).

### Frontend (React/Vite)

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies (if not already installed):

   ```
   npm install
   ```

   Or using pnpm (recommended):

   ```
   pnpm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

   Or with pnpm:

   ```
   pnpm dev
   ```

The frontend development server will start on port 5173 (Vite's default).

## Accessing the Application

Once both servers are running, you can access the application in your browser at:
http://localhost:5173
