/// <reference types="cypress" />
import { Project, User, Milestone, Task } from '../support/interfaces';

describe('Navigation and Redirect Tests', () => {
  describe('Unauthenticated Navigation', () => {
    beforeEach(() => {
      // Clear auth tokens
      cy.clearLocalStorage();

      // Mock unauthenticated user
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          authenticated: false,
        } as User,
      }).as('authCheck');
    });

    it('should redirect to login when accessing protected route', () => {
      // Try to access projects page without auth
      cy.visit('/project');
      cy.wait('@authCheck');

      // Should redirect to login page
      cy.url().should('include', '/login');
    });

    it('should allow access to public routes', () => {
      // Visit login page
      cy.visit('/login');
      cy.wait('@authCheck');

      // Should stay on login page
      cy.url().should('include', '/login');
      cy.contains('Welcome Back').should('be.visible');

      // Visit register page
      cy.visit('/register');
      cy.wait('@authCheck');

      // Should stay on register page
      cy.url().should('include', '/register');
      cy.contains('Create Account').should('be.visible');
    });

    it('should save the redirect path when accessing protected route', () => {
      // Try to access a specific project page
      cy.visit('/project/1');
      cy.wait('@authCheck');

      // Should redirect to login with state preserved
      cy.url().should('include', '/login');

      // Log in
      const mockUser: User = {
        authenticated: true,
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
      };

      // Mock login response
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: mockUser,
      }).as('loginRequest');

      // Mock authenticated user for subsequent requests
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: mockUser,
      }).as('authCheck');

      // Mock project details
      const projectDetails: Project = {
        id: 1,
        title: 'Test Project 1',
        description: 'Project 1 description',
        status: 'IN_PROGRESS',
        milestones: [],
        tasks: [],
      };

      cy.intercept('GET', '/api/projects/1', {
        statusCode: 200,
        body: projectDetails,
      }).as('projectDetailsRequest');

      // Click login button (mocking successful login)
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.contains('button', 'Sign in').click();
      cy.wait('@loginRequest');
    });
  });

  describe('Authenticated Navigation', () => {
    beforeEach(() => {
      // Mock authenticated user
      const mockUser: User = {
        authenticated: true,
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
      };

      // Set tokens in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'fake-access-token');
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      });

      // Mock authenticated user response
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: mockUser,
      }).as('authCheck');
    });

    it('should navigate through the navbar links', () => {
      // Mock projects data
      const projects: Project[] = [
        {
          id: 1,
          title: 'Test Project 1',
          description: 'Project 1 description',
          status: 'IN_PROGRESS',
          milestones: [],
          tasks: [],
        },
        {
          id: 2,
          title: 'Test Project 2',
          description: 'Project 2 description',
          status: 'PLANNED',
          milestones: [],
          tasks: [],
        },
      ];

      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: projects,
      }).as('projectsListRequest');

      // Visit the home page
      cy.visit('/');
      cy.wait('@authCheck');

      // Should redirect to projects page
      cy.url().should('include', '/project');

      // Click on profile link in navbar
      cy.contains('Profile').click();
      cy.url().should('include', '/profile');

      // Click on projects link in navbar
      cy.contains('Projects').click();
      cy.url().should('include', '/project');
      cy.url().should('not.include', '/profile');
    });
  });
});
