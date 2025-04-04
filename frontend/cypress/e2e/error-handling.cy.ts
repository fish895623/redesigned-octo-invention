/// <reference types="cypress" />
import { User, Project } from '../support/interfaces';

describe('Error Handling', () => {
  describe('API Error Handling', () => {
    beforeEach(() => {
      // Setup authenticated user state
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

      // Mock successful auth check
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: mockUser,
      }).as('authCheck');
    });

    it('should handle 404 API errors gracefully', () => {
      // Mock 404 response for a non-existent project
      cy.intercept('GET', '/api/projects/999', {
        statusCode: 404,
        body: { message: 'Project not found' },
      }).as('notFoundRequest');

      // Visit non-existent project
      cy.visit('/project/999');
      cy.wait('@notFoundRequest');

      // Should show error message
      cy.contains('Project not found').should('be.visible');
      cy.contains('Return to Projects').should('be.visible');

      // Should allow navigation back to projects
      cy.contains('Return to Projects').click();
      cy.url().should('include', '/project');
      cy.url().should('not.include', '/999');
    });

    it('should handle 500 server errors gracefully', () => {
      // Mock 500 response for projects list
      cy.intercept('GET', '/api/projects', {
        statusCode: 500,
        body: { message: 'Internal server error' },
      }).as('serverErrorRequest');

      // Visit projects page
      cy.visit('/project');
      cy.wait('@serverErrorRequest');

      // Should show error message
      cy.contains('Server Error').should('be.visible');
      cy.contains('Please try again later').should('be.visible');

      // Should show retry button
      cy.contains('Retry').should('be.visible');

      // Mock successful response for retry
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: [
          {
            id: 1,
            title: 'Test Project',
            description: 'Test Description',
            status: 'IN_PROGRESS',
            milestones: [],
            tasks: [],
          },
        ] as Project[],
      }).as('retryRequest');

      // Click retry
      cy.contains('Retry').click();
      cy.wait('@retryRequest');

      // Should show projects
      cy.contains('Test Project').should('be.visible');
    });

    it('should handle 403 forbidden errors', () => {
      // Mock 403 response for projects list
      cy.intercept('GET', '/api/projects', {
        statusCode: 403,
        body: { message: 'Forbidden' },
      }).as('forbiddenRequest');

      // Visit projects page
      cy.visit('/project');
      cy.wait('@forbiddenRequest');

      // Should show error message
      cy.contains('Access Denied').should('be.visible');
      cy.contains('You do not have permission').should('be.visible');

      // Should show login button
      cy.contains('Re-login').should('be.visible');

      // Click re-login button
      cy.contains('Re-login').click();
      cy.url().should('include', '/login');
    });

    it('should handle token expiration and refresh', () => {
      // Mock 401 response for projects list (expired token)
      cy.intercept('GET', '/api/projects', {
        statusCode: 401,
        body: { message: 'Token expired' },
      }).as('expiredTokenRequest');

      // Mock successful token refresh
      cy.intercept('POST', '/api/auth/refresh', {
        statusCode: 200,
        body: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      }).as('tokenRefreshRequest');

      // Mock successful projects response after token refresh
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: [
          {
            id: 1,
            title: 'Test Project',
            description: 'Test Description',
            status: 'IN_PROGRESS',
            milestones: [],
            tasks: [],
          },
        ] as Project[],
      }).as('projectsAfterRefresh');

      // Visit projects page
      cy.visit('/project');

      // Verify token refresh occurred
      cy.wait('@expiredTokenRequest');
      cy.wait('@tokenRefreshRequest');
      cy.wait('@projectsAfterRefresh');

      // Should show projects after refresh
      cy.contains('Test Project').should('be.visible');

      // Verify new tokens were saved
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.equal('new-access-token');
        expect(win.localStorage.getItem('refreshToken')).to.equal('new-refresh-token');
      });
    });

    it('should handle token refresh failure', () => {
      // Mock 401 response for projects list (expired token)
      cy.intercept('GET', '/api/projects', {
        statusCode: 401,
        body: { message: 'Token expired' },
      }).as('expiredTokenRequest');

      // Mock failed token refresh
      cy.intercept('POST', '/api/auth/refresh', {
        statusCode: 401,
        body: { message: 'Invalid refresh token' },
      }).as('tokenRefreshFailure');

      // Visit projects page
      cy.visit('/project');

      // Verify token refresh failed
      cy.wait('@expiredTokenRequest');
      cy.wait('@tokenRefreshFailure');

      // Should redirect to login page
      cy.url().should('include', '/login');

      // Verify tokens were cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.be.null;
        expect(win.localStorage.getItem('refreshToken')).to.be.null;
      });
    });
  });

  describe('Form Validation Errors', () => {
    beforeEach(() => {
      // Setup authenticated user state
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

      // Mock successful auth check
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: mockUser,
      }).as('authCheck');
    });

    it('should display form validation errors on project creation', () => {
      // Mock projects list
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: [] as Project[],
      }).as('projectsRequest');

      // Visit projects page
      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsRequest');

      // Click create new project button
      cy.contains('Add Project').click();

      // Try to submit without name
      cy.contains('button', 'Create').click();

      // Should show validation error
      cy.contains('Project name is required').should('be.visible');

      // Enter project name only
      cy.get('input[name="name"]').type('Test Project');
      cy.contains('button', 'Create').click();

      // Should show validation error for description
      cy.contains('Description is required').should('be.visible');

      // Fill all required fields
      cy.get('textarea[name="description"]').type('Test Description');

      // Mock successful project creation
      cy.intercept('POST', '/api/projects', {
        statusCode: 201,
        body: {
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          status: 'PLANNED',
          milestones: [],
          tasks: [],
        } as Project,
      }).as('createProjectRequest');

      // Submit form
      cy.contains('button', 'Create').click();
      cy.wait('@createProjectRequest');

      // Should redirect to project details
      cy.url().should('include', '/project/1');
    });

    it('should display form validation errors on invalid task dates', () => {
      // Mock project details
      const project: Project = {
        id: 1,
        title: 'Test Project',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        milestones: [],
        tasks: [],
      };

      cy.intercept('GET', '/api/projects/1', {
        statusCode: 200,
        body: project,
      }).as('projectRequest');

      // Visit project details page
      cy.visit('/project/1');
      cy.wait('@authCheck');
      cy.wait('@projectRequest');

      // Navigate to tasks
      cy.contains('View Tasks').click();

      // Click add task button
      cy.contains('Add Task').click();

      // Fill required fields except date
      cy.get('input[name="name"]').type('Test Task');
      cy.get('textarea[name="description"]').type('Test Description');
      cy.get('select[name="priority"]').select('HIGH');

      // Set past due date (yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      cy.get('input[name="dueDate"]').type(yesterdayStr);

      // Try to submit
      cy.contains('button', 'Create').click();

      // Should show date validation error
      cy.contains('Due date cannot be in the past').should('be.visible');

      // Set future date
      const future = new Date();
      future.setDate(future.getDate() + 10);
      const futureStr = future.toISOString().split('T')[0];

      cy.get('input[name="dueDate"]').clear().type(futureStr);

      // Mock successful task creation
      cy.intercept('POST', '/api/projects/1/tasks', {
        statusCode: 201,
        body: {
          id: 1,
          name: 'Test Task',
          description: 'Test Description',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: futureStr,
          projectId: 1,
        },
      }).as('createTaskRequest');

      // Submit form
      cy.contains('button', 'Create').click();
      cy.wait('@createTaskRequest');

      // Should redirect to task list
      cy.url().should('include', '/project/1/task');
      cy.url().should('not.include', '/new');
    });
  });
});
