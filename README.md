# Project Management System

<div align="center">

![Project Management System Logo](https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=PMS)

**A modern, full-stack project management solution for efficient team collaboration**

[![Project Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/yourusername/redesigned-octo-invention)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Contributors](https://img.shields.io/badge/contributors-welcome-orange.svg)](CONTRIBUTING.md)

[🚀 Live Demo](#demo) • [📖 Documentation](#documentation) • [🛠️ Installation](#installation) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Key Features](#key-features)
- [🏗️ Technology Stack](#technology-stack)
- [🚀 Demo](#demo)
- [🛠️ Installation](#installation)
- [⚡ Quick Start](#quick-start)
- [🔧 Development](#development)
- [📚 API Documentation](#api-documentation)
- [🏛️ Architecture](#architecture)
- [🚢 Deployment](#deployment)
- [🧪 Testing](#testing)
- [🤝 Contributing](#contributing)
- [📄 License](#license)
- [🙏 Acknowledgments](#acknowledgments)

## Overview

A modern project management system that enables teams to efficiently organize, track, and complete projects. Built with **Spring Boot** and **React**, this application provides robust backend services and an intuitive, responsive frontend experience designed for modern web standards.

### 🎯 Why This Project?

- **Modern Tech Stack**: Built with the latest versions of Spring Boot and React
- **Full-Stack Solution**: Complete backend API with responsive frontend
- **Production Ready**: Includes testing, security, and deployment configurations
- **Developer Friendly**: Comprehensive documentation and development tools

## ✨ Key Features

### 👥 User Management

- 🔐 **Secure Authentication**: JWT-based authentication with Spring Security
- 🌐 **OAuth2 Integration**: Google OAuth2 for seamless login
- 👤 **Role-Based Access**: Granular permissions and user roles
- 📱 **Responsive Design**: Mobile-first, responsive UI

### 📊 Project Organization

- 🎨 **Customizable Dashboards**: Personalized project views
- 📈 **Progress Visualization**: Real-time progress tracking with charts
- 👥 **Team Management**: Assign and manage team members efficiently
- 🏷️ **Project Categories**: Organize projects by categories and tags

### 🎯 Milestones & Tasks

- 📝 **Hierarchical Task Management**: Nested tasks and subtasks
- ⏰ **Deadline Tracking**: Milestone management with notifications
- 🔥 **Priority-Based Workflow**: Task prioritization and sorting
- 📎 **File Attachments**: Document and media file support

### 🤝 Team Collaboration

- ⚡ **Real-time Updates**: Live updates using WebSocket
- 💬 **Comments & Discussions**: Task-level commenting system
- 📋 **Activity Logging**: Comprehensive audit trail
- 🔔 **Notifications**: Email and in-app notifications

## 🏗️ Technology Stack

<div align="center">

### Backend

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.4-green?style=for-the-badge&logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-purple?style=for-the-badge&logo=jsonwebtokens)

### Frontend

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-teal?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6-yellow?style=for-the-badge&logo=vite)

</div>

### Backend Technologies

```
Core Framework:     Java 21, Spring Boot 3.4.4
Security:          Spring Security, JWT, OAuth2
Database:          PostgreSQL, Spring Data JPA
API:               RESTful with Spring WebFlux
Build Tool:        Gradle
Testing:           JUnit 5, Spring Test, Mockito
Code Quality:      Checkstyle, SpotBugs, Spotless
```

### Frontend Technologies

```
Core:              React 18, TypeScript 5.7
Routing:           React Router 7
Styling:           TailwindCSS 4, Material Tailwind
HTTP Client:       Axios
Build Tool:        Vite 6
Testing:           Cypress, Vitest
Development:       Storybook 8, ESLint, Prettier
```

## 🚀 Demo

> **🌟 Live Demo**: [https://your-demo-url.com](https://your-demo-url.com)

### Screenshots

<details>
<summary>📱 Click to view application screenshots</summary>

| Dashboard                                                                      | Project View                                                                 | Task Management                                                        |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![Dashboard](https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Dashboard) | ![Projects](https://via.placeholder.com/300x200/059669/FFFFFF?text=Projects) | ![Tasks](https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Tasks) |

</details>

### Demo Credentials

```
Email:    demo@projectmanage.com
Password: demo123
```

## 🛠️ Installation

### Prerequisites

Ensure you have the following installed:

- ☕ **Java 21+** - [Download here](https://openjdk.org/projects/jdk/21/)
- 🟢 **Node.js 18+** - [Download here](https://nodejs.org/)
- 📦 **pnpm** (recommended) - `npm install -g pnpm`
- 🐘 **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/)

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/redesigned-octo-invention.git
   cd redesigned-octo-invention
   ```

2. **Database Setup**

   ```sql
   -- Create database
   CREATE DATABASE projectmanage;
   CREATE USER projectmanage_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE projectmanage TO projectmanage_user;
   ```

3. **Environment Configuration**
   ```bash
   # Copy and configure environment variables
   cp .env.template .env
   # Edit .env with your database and OAuth credentials
   ```

## ⚡ Quick Start

### 🖥️ Backend Server

```bash
# Start the Spring Boot application
./gradlew bootRun
```

The backend API will be available at **http://localhost:8080**

### 🌐 Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The frontend application will be available at **http://localhost:5173**

### 🐳 Docker Setup (Alternative)

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🔧 Development

### Backend Development

```bash
# Run tests
./gradlew test

# Run with hot reload
./gradlew bootRun --continuous

# Code formatting
./gradlew spotlessApply

# Code quality checks
./gradlew checkstyleMain spotbugsMain

# Generate test coverage report
./gradlew jacocoTestReport
```

### Frontend Development

```bash
# Development server with hot reload
pnpm dev

# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Component development with Storybook
pnpm storybook

# Type checking
pnpm type-check

# Linting and formatting
pnpm lint
pnpm format
```

### 🔥 Hot Reload Setup

Both backend and frontend support hot reload for efficient development:

- **Backend**: Automatic restart on Java file changes
- **Frontend**: Instant updates on TypeScript/React changes

## 📚 API Documentation

### Base URL

```
Development: http://localhost:8080/api
Production:  https://your-domain.com/api
```

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/oauth2/google
POST /api/auth/refresh
```

### Projects

```http
GET    /api/projects          # List all projects
POST   /api/projects          # Create new project
GET    /api/projects/{id}     # Get project details
PUT    /api/projects/{id}     # Update project
DELETE /api/projects/{id}     # Delete project
```

### Tasks

```http
GET    /api/projects/{id}/tasks     # List project tasks
POST   /api/projects/{id}/tasks     # Create new task
PUT    /api/tasks/{id}              # Update task
DELETE /api/tasks/{id}              # Delete task
```

> 📖 **Full API Documentation**: [Swagger UI](http://localhost:8080/swagger-ui.html) (when running locally)

## 🏛️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │◄──►│  Spring Boot    │◄──►│   PostgreSQL    │
│                 │    │     Backend     │    │    Database     │
│  • React 18     │    │  • Java 21      │    │  • User Data    │
│  • TypeScript   │    │  • Spring Boot  │    │  • Projects     │
│  • TailwindCSS  │    │  • JWT Security │    │  • Tasks        │
│  • Vite         │    │  • REST API     │    │  • Files        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────┐
│              Controllers                │  ← REST API Layer
├─────────────────────────────────────────┤
│               Services                  │  ← Business Logic
├─────────────────────────────────────────┤
│             Repositories                │  ← Data Access Layer
├─────────────────────────────────────────┤
│          Domain Models                  │  ← Entity Layer
└─────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│          Pages & Routing                │  ← Application Pages
├─────────────────────────────────────────┤
│         React Components                │  ← UI Components
├─────────────────────────────────────────┤
│        Context & Hooks                  │  ← State Management
├─────────────────────────────────────────┤
│           API Services                  │  ← Backend Integration
└─────────────────────────────────────────┘
```

## 🚢 Deployment

### Production Build

```bash
# Build frontend for production
cd frontend
pnpm build:prod

# Build backend (includes compiled frontend)
./gradlew build

# Run the application
java -jar build/libs/project-management-system-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

```bash
# Build Docker image
docker build -t project-management-system .

# Run with Docker
docker run -p 8080:8080 project-management-system
```

### Cloud Deployment

<details>
<summary>🚀 Deploy to Various Platforms</summary>

#### Heroku

```bash
# Install Heroku CLI and login
heroku create your-app-name
git push heroku main
```

#### AWS

```bash
# Using AWS Elastic Beanstalk
eb init
eb create production
eb deploy
```

#### DigitalOcean

```bash
# Using App Platform
doctl apps create --spec .do/app.yaml
```

</details>

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests UserServiceTest

# Generate coverage report
./gradlew jacocoTestReport
open build/reports/jacoco/test/html/index.html
```

### Frontend Testing

```bash
# Unit tests with Vitest
pnpm test

# E2E tests with Cypress
pnpm test:e2e

# Run tests in CI mode
pnpm test:ci

# Generate coverage report
pnpm test:coverage
```

### Test Coverage

- **Backend**: Target 80%+ coverage
- **Frontend**: Target 75%+ coverage
- **E2E**: Critical user journeys covered

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- ✅ Follow existing code style
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Ensure all tests pass

### Issue Reporting

Found a bug? Have a feature request? Please [open an issue](https://github.com/yourusername/redesigned-octo-invention/issues/new) with:

- 🐛 **Bug Report**: Steps to reproduce, expected behavior, screenshots
- 💡 **Feature Request**: Description, use case, mockups (if applicable)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - feel free to use this project for personal or commercial purposes.
```

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and these fantastic projects:

- 🍃 [Spring Boot](https://spring.io/projects/spring-boot) - The backbone of our backend
- ⚛️ [React](https://reactjs.org/) - The heart of our frontend
- 🎨 [TailwindCSS](https://tailwindcss.com/) - Beautiful, utility-first CSS
- 🧩 [Material Tailwind](https://material-tailwind.com/) - Pre-built components
- 🚀 [Vite](https://vitejs.dev/) - Lightning-fast build tool
- 🐘 [PostgreSQL](https://www.postgresql.org/) - Reliable database engine

---

<div align="center">

**[⬆ Back to Top](#project-management-system)**

Made with ❤️ by [Your Name](https://github.com/yourusername)

[![GitHub stars](https://img.shields.io/github/stars/yourusername/redesigned-octo-invention?style=social)](https://github.com/yourusername/redesigned-octo-invention/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/redesigned-octo-invention?style=social)](https://github.com/yourusername/redesigned-octo-invention/network/members)

</div>
