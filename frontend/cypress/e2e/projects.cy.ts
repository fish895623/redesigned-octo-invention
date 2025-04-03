/// <reference types="cypress" />
import { Project } from '../support/interfaces';

describe('Project Management Tests', () => {
  // Set up auth state before each test
  beforeEach(() => {
    // Use custom login command
    cy.login('test@example.com', 'password123');
  });

  describe('Project List Page', () => {
    beforeEach(() => {
      cy.mockProjects();
    });

    it('should create new project', () => {
      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsListRequest');

      // Define a new project object with TypeScript interface
      const newProject: Project = {
        id: 3,
        name: 'New Project',
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
      }).as('createProjectRequest');

      // Open the create project modal
      cy.contains('button', 'Add Project').click();

      // Fill out the form
      cy.get('input[type="text"]').type(newProject.name);
      cy.get('textarea').type(newProject.description);

      // Submit the form
      cy.contains('button', 'Create Project').click();

      // Wait for the create request
      cy.wait('@createProjectRequest');

      // Verify the new project appears in the list
      cy.contains(newProject.name).should('be.visible');
      cy.contains(newProject.description).should('be.visible');
    });

    it('should display project list correctly', () => {
      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsListRequest');

      // Check if projects are displayed
      cy.contains('Test Project 1').should('be.visible');
      cy.contains('Test Project 2').should('be.visible');
      cy.contains('Project 1 description').should('be.visible');
      cy.contains('Project 2 description').should('be.visible');
    });

    it('should edit project', () => {
      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsListRequest');

      // Mock the project details and update API responses
      cy.mockProjectDetails(1);

      // Click on the first project to navigate to details
      cy.contains('Test Project 1').click();
      cy.wait('@projectDetailsRequest');

      // Define the updated project with TypeScript interface
      const updatedProject: Project = {
        id: 1,
        name: 'Updated Project Name',
        description: 'Updated project description',
        status: 'COMPLETED',
        milestones: [],
        tasks: [],
        createdAt: new Date(2023, 0, 1),
        updatedAt: new Date(),
      };

      // Mock the project update API response
      cy.intercept('PUT', '/api/projects/1', {
        statusCode: 200,
        body: updatedProject,
      }).as('updateProjectRequest');

      // Click edit button
      cy.contains('button', 'Edit').click();

      // Update form fields
      cy.get('input[type="text"]').clear().type(updatedProject.name);
      cy.get('textarea').clear().type(updatedProject.description);

      // Submit the form by blurring the input (this triggers the save in most forms)
      cy.get('input[type="text"]').blur();

      // Wait for the update request
      cy.wait('@updateProjectRequest');

      // Verify updated details are displayed
      cy.contains(updatedProject.name).should('be.visible');
      cy.contains(updatedProject.description).should('be.visible');
    });

    it('should delete project', () => {
      cy.visit('/project');
      cy.wait('@authCheck');
      cy.wait('@projectsListRequest');

      // Mock the project details API response
      cy.mockProjectDetails(1);

      // Click on the first project to navigate to details
      cy.contains('Test Project 1').click();
      cy.wait('@projectDetailsRequest');

      // Mock the project delete API response
      cy.intercept('DELETE', '/api/projects/1', {
        statusCode: 200,
      }).as('deleteProjectRequest');

      // Click delete button and confirm
      cy.contains('button', 'Delete').click();
      // Use the window:confirm handler to simulate confirmation
      cy.on('window:confirm', () => true);

      // Wait for the delete request
      cy.wait('@deleteProjectRequest');

      // Define the remaining projects array after deletion
      const remainingProjects: Project[] = [
        {
          id: 2,
          name: 'Test Project 2',
          description: 'Project 2 description',
          status: 'PLANNED',
          milestones: [],
          tasks: [],
          createdAt: new Date(2023, 1, 1),
          updatedAt: new Date(2023, 1, 15),
        },
      ];

      // Mock updated project list (without the deleted project)
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: remainingProjects,
      });

      // Should redirect to projects list
      cy.url().should('include', '/project');
      cy.url().should('not.include', '/project/1');

      // Verify the deleted project is no longer in the list
      cy.contains('Test Project 1').should('not.exist');
    });
  });
});
