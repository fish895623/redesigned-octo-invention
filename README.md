# Project Management Application

A full-stack project management application with Google OAuth2 authentication.

## Tech Stack

- Backend: Spring Boot, Spring Security, OAuth2, JPA, PostgreSQL
- Frontend: React, TypeScript, Vite

## Setting Up Google OAuth2

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set up the consent screen if prompted
6. Select "Web application" as the application type
7. Add authorized JavaScript origins: `http://localhost:8080`
8. Add authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google`
9. Copy the Client ID and Client Secret

## Environment Variables

Create a `.env` file in the root folder with the following variables (copy from `.env.example`):

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/projectmanage
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=yourpassword

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
```

## Running the Application

### Backend

```bash
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## OAuth2 Flow

1. User clicks "Login with Google" button on frontend
2. Frontend redirects to `/oauth2/authorization/google`
3. Spring Security handles redirect to Google
4. User authenticates with Google
5. Google redirects back to `/login/oauth2/code/google`
6. Spring Security processes the OAuth2 token
7. User is redirected back to the frontend
8. Frontend fetches user info from backend API
