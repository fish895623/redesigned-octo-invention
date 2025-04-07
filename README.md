# Project Management System

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-green)
![React](https://img.shields.io/badge/React-18-blue)

## Overview

A modern project management system that enables teams to efficiently organize, track, and complete projects. Built with Spring Boot and React, this application provides robust backend services and an intuitive, responsive frontend experience.

## Key Features

- **User Management**
  - Secure registration and authentication
  - OAuth2 integration with Google
  - Role-based permissions

- **Project Organization**
  - Customizable project dashboards
  - Progress visualization
  - Team assignment and management

- **Milestones & Tasks**
  - Hierarchical task management
  - Milestone tracking with deadlines
  - Priority-based workflow

- **Team Collaboration**
  - Real-time updates
  - File attachment support
  - Activity logging and history

## Technology Stack

### Backend
- **Core**: Java 21, Spring Boot 3.4.4
- **Security**: Spring Security, JWT, OAuth2
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA/Hibernate
- **API**: REST with Spring WebFlux
- **Build Tool**: Gradle
- **Testing**: JUnit, Spring Test

### Frontend
- **Core**: React 18, TypeScript 5.7
- **Routing**: React Router 7
- **UI/Styling**: Material Tailwind, TailwindCSS 4
- **HTTP Client**: Axios
- **Build Tool**: Vite 6
- **Testing**: Cypress, Vitest
- **Component Dev**: Storybook 8

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+ and pnpm (recommended)
- PostgreSQL database

### Running Locally

#### Backend
```bash
# From project root
./gradlew bootRun
```
Backend API will be available at http://localhost:8080

#### Frontend
```bash
# From project root
cd frontend
pnpm install
pnpm dev
```
Frontend application will be available at http://localhost:5173

## Development

### Backend
```bash
# Run tests
./gradlew test

# Code formatting
./gradlew spotlessApply

# Code style checks
./gradlew checkstyleMain
```

### Frontend
```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run component library
pnpm storybook

# Build for production
pnpm build:prod
```

## Architecture

The application follows a layered architecture:

- **Backend**
  - Controller Layer: REST API endpoints
  - Service Layer: Business logic
  - Repository Layer: Data access
  - Model Layer: Domain entities

- **Frontend**
  - Component Layer: Reusable UI components
  - Page Layer: Application screens
  - API Layer: Backend communication
  - Context Layer: State management

## Deployment

### Production Build
```bash
# Build frontend
cd frontend
pnpm build:prod

# Build backend (includes compiled frontend)
./gradlew build

# Run application
java -jar build/libs/project-management-system-0.0.1-SNAPSHOT.jar
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Material Tailwind](https://material-tailwind.com/)
