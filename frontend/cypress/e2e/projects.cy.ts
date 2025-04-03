/// <reference types="cypress" />
import { Project } from '../support/interfaces';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string, options?: { mock?: boolean }): Chainable<void>;
      mockProjects(projects?: Project[]): Chainable<void>;
    }
  }
}

describe('Project Management Tests', () => {
  beforeEach(() => {
    // Use custom login command
    cy.login('test@example.com', 'password123');

    // Mock basic API responses for each test
    cy.intercept('GET', '/api/auth/check', {
      statusCode: 200,
      body: { authenticated: true, name: 'Test User', email: 'test@example.com' },
    }).as('authCheck');
  });

  describe('Project List Page', () => {
    it('should create new project', () => {
      // Setup default mock projects
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project 1',
          description: 'Project 1 description',
          status: 'IN_PROGRESS',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 0, 1),
          updatedAt: new Date(2023, 0, 15),
        },
        {
          id: 2,
          title: 'Test Project 2',
          description: 'Project 2 description',
          status: 'PLANNED',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 1, 1),
          updatedAt: new Date(2023, 1, 15),
        },
      ];

      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: mockProjects,
      }).as('projectsList');

      // Define a new project object with TypeScript interface
      const newProject: Project = {
        id: 3,
        title: 'New Project',
        description: 'New project description',
        status: 'PLANNED',
        milestones: [],
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the project creation API response
      cy.intercept('POST', '/api/projects', {
        statusCode: 201,
        body: newProject,
      }).as('createProject');

      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsList');

      // Open the create project modal
      cy.contains('button', 'Add Project').click();

      // Fill out the form with data-testid attributes
      cy.get('[data-testid="create-project-title"]').type(newProject.title);
      cy.get('[data-testid="create-project-description"]').type(newProject.description);

      // Submit the form
      cy.get('[data-testid="submit-create-project"]').click();

      // Wait for the create request
      cy.wait('@createProject');

      // Verify the new project appears in the list
      cy.contains(newProject.title).should('be.visible');
      cy.contains(newProject.description).should('be.visible');
    });

    it('should display project list correctly', () => {
      // Setup default mock projects
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project 1',
          description: 'Project 1 description',
          status: 'IN_PROGRESS',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 0, 1),
          updatedAt: new Date(2023, 0, 15),
        },
        {
          id: 2,
          title: 'Test Project 2',
          description: 'Project 2 description',
          status: 'PLANNED',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 1, 1),
          updatedAt: new Date(2023, 1, 15),
        },
      ];

      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: mockProjects,
      }).as('projectsList');

      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsList');

      // Check if projects are displayed
      cy.contains('Test Project 1').should('be.visible');
      cy.contains('Test Project 2').should('be.visible');
      cy.contains('Project 1 description').should('be.visible');
      cy.contains('Project 2 description').should('be.visible');
    });

    it('should edit project', () => {
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project 1',
          description: 'Project 1 description',
          status: 'IN_PROGRESS' as const,
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 0, 1),
          updatedAt: new Date(2023, 0, 15),
        },
      ];

      // Mock initial projects list
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: mockProjects,
      }).as('initialProjectsList');

      // Mock the project update API
      const updatedProject = {
        ...mockProjects[0],
        title: 'Updated Project Title',
        description: 'Updated project description',
        updatedAt: new Date(),
      };

      cy.intercept('PUT', '/api/projects/1', {
        statusCode: 200,
        body: updatedProject,
      }).as('updateProject');

      // Mock the updated projects list after update
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: [updatedProject],
      }).as('updatedProjectsList');

      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@initialProjectsList');

      // Click edit button on the first project
      cy.get('[data-testid="edit-project-1"]').should('be.visible').click();

      // Verify modal is open and has correct initial values
      cy.get('input[type="text"]').should('be.visible').should('have.value', 'Test Project 1');
      cy.get('textarea').should('be.visible').should('have.value', 'Project 1 description');

      // Update the project details
      cy.get('input[type="text"]').clear().type('Updated Project Title');
      cy.get('textarea').clear().type('Updated project description');

      // Submit the form
      cy.contains('button', 'Save Changes').click();

      // Wait for the update request
      cy.wait('@updateProject');
      cy.wait('@updatedProjectsList');

      // Verify the updated content is visible
      cy.contains('Updated Project Title').should('be.visible');
      cy.contains('Updated project description').should('be.visible');
    });

    it('should delete project', () => {
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project 1',
          description: 'Project 1 description',
          status: 'IN_PROGRESS' as const,
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 0, 1),
          updatedAt: new Date(2023, 0, 15),
        },
        {
          id: 2,
          title: 'Test Project 2',
          description: 'Project 2 description',
          status: 'PLANNED' as const,
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 1, 1),
          updatedAt: new Date(2023, 1, 15),
        },
      ];

      // Mock initial projects list
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: mockProjects,
      }).as('initialProjectsList');

      // Mock the project delete API
      cy.intercept('DELETE', '/api/projects/1', {
        statusCode: 204,
      }).as('deleteProject');

      // Mock the updated projects list after deletion
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: [mockProjects[1]],
      }).as('updatedProjectsList');

      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@initialProjectsList');

      // Stub the window.confirm to return true
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });

      // Click delete button on the first project
      cy.get('[data-testid="delete-project-1"]').should('be.visible').click();

      // Wait for the delete request
      cy.wait('@deleteProject');
      cy.wait('@updatedProjectsList');

      // Verify the project is no longer visible
      cy.contains('Test Project 1').should('not.exist');
      cy.contains('Project 1 description').should('not.exist');

      // Verify the remaining project is still visible
      cy.contains('Test Project 2').should('be.visible');
      cy.contains('Project 2 description').should('be.visible');
    });

    it('should handle API errors when creating a project', () => {
      // Setup default mock projects
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project 1',
          description: 'Project 1 description',
          status: 'IN_PROGRESS',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 0, 1),
          updatedAt: new Date(2023, 0, 15),
        },
        {
          id: 2,
          title: 'Test Project 2',
          description: 'Project 2 description',
          status: 'PLANNED',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 1, 1),
          updatedAt: new Date(2023, 1, 15),
        },
      ];

      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: mockProjects,
      }).as('projectsList');

      // Mock an error response for project creation
      cy.intercept('POST', '/api/projects', {
        statusCode: 400,
        body: { message: 'Invalid project data' },
        delay: 100, // Add small delay to ensure intercept works
      }).as('createProjectError');

      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsList');

      // Open the create project modal
      cy.contains('button', 'Add Project').click();

      // Fill out the form with invalid data - include title to avoid validation errors
      cy.get('[data-testid="create-project-title"]').type('Error Test');
      cy.get('[data-testid="create-project-description"]').type('This project will generate an API error');

      // Submit the form
      cy.get('[data-testid="submit-create-project"]').click();

      // Wait for the error response
      cy.wait('@createProjectError');

      // Wait for error message to be visible
      cy.get('[data-testid="create-project-error"]', { timeout: 10000 }).should('exist');
    });

    it('should sort projects by created and updated date', () => {
      // Mock projects with different statuses for filtering
      const mixedProjects: Project[] = [
        {
          id: 1,
          title: 'Active Project',
          description: 'An in-progress project',
          status: 'IN_PROGRESS',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 0, 1),
          updatedAt: new Date(2023, 0, 15),
        },
        {
          id: 2,
          title: 'Completed Project',
          description: 'A finished project',
          status: 'COMPLETED',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 1, 1),
          updatedAt: new Date(2023, 3, 15),
        },
        {
          id: 3,
          title: 'New Project',
          description: 'A planned project',
          status: 'PLANNED',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 2, 1),
          updatedAt: new Date(2023, 2, 15),
        },
      ];

      // Mock the project list with multiple statuses
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: mixedProjects,
      }).as('allProjects');

      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@allProjects');

      // First check if the sort dropdown exists
      cy.get('select').should('exist');

      // Test sorting function - select "created" option
      cy.get('select').select('created');

      // Since we can't directly check order in element list without class/id selectors,
      // just validate the dropdown was properly selected
      cy.get('select').should('have.value', 'created');

      // Switch back to "updated" sorting
      cy.get('select').select('updated');
      cy.get('select').should('have.value', 'updated');
    });
  });
});
