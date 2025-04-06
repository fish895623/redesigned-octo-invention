/// <reference types="cypress" />
import { Project } from '../../src/types/project';

describe('Milestones', () => {
  beforeEach(() => {
    // Define test project with milestones aligned with backend MilestoneDTO structure
    const testProject: Project = {
      id: 1,
      title: 'Test Project',
      description: 'Project description',
      milestones: [
        {
          id: 1,
          title: 'Milestone 1',
          description: 'First milestone',
          dueDate: new Date('2023-12-31'),
          projectId: 1,
          completed: false,
          startDate: undefined,
          tasks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Milestone 2',
          description: 'Second milestone',
          dueDate: new Date('2024-01-31'),
          projectId: 1,
          completed: false,
          startDate: undefined,
          tasks: [
            {
              id: 1,
              title: 'Task 1',
              description: 'First task',
              completed: false,
              projectId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the projects list API response
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [testProject],
    }).as('projectsListRequest');

    // Mock the specific project API response
    cy.intercept('GET', '/api/projects/1', {
      statusCode: 200,
      body: testProject,
    }).as('projectDetailsRequest');

    // Mock the milestones list API response
    cy.intercept('GET', '/api/projects/1/milestones', {
      statusCode: 200,
      body: testProject.milestones,
    }).as('milestonesListRequest');

    // Mock specific milestone details API response
    cy.intercept('GET', '/api/projects/1/milestones/1', {
      statusCode: 200,
      body: testProject.milestones[0],
    }).as('milestoneDetailsRequest');

    // Mock milestone creation API
    cy.intercept('POST', '/api/projects/1/milestones', (req) => {
      return {
        statusCode: 200,
        body: {
          ...req.body,
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }).as('createMilestoneRequest');

    // Mock milestone update API
    cy.intercept('PUT', '/api/projects/1/milestones/*', {
      statusCode: 200,
      body: 'Milestone updated successfully',
    }).as('updateMilestoneRequest');

    // Mock milestone deletion API
    cy.intercept('DELETE', '/api/projects/1/milestones/*', {
      statusCode: 200,
      body: 'Milestone deleted successfully',
    }).as('deleteMilestoneRequest');

    // Login before each test
    // Use custom login command
    cy.login('test@example.com', 'password123');

    // Mock basic API responses for each test
    cy.intercept('GET', '/api/auth/check', {
      statusCode: 200,
      body: { authenticated: true, name: 'Test User', email: 'test@example.com' },
    }).as('authCheck');
  });

  it('should display list of milestones', () => {
    cy.visit('/projects/1/milestones');

    cy.get('a')
      .contains('Test Project')
      .click();
    // Check if the number of milestones is displayed
    cy.get('span')
      .contains('2')
      .should('be.visible');
    // Check if the milestones are displayed
    cy.get('h3')
      .contains('Milestone 1')
      .should('be.visible');
    cy.get('h3')
      .contains('Milestone 2')
      .should('be.visible');
  });

  it('should add milestones on projects', () => {
    cy.visit('/projects/1/milestones');

    cy.get('a')
      .contains('Test Project')
      .click();

    cy.get('button')
      .contains('Add Milestone')
      .click();

    cy.get('form > :nth-child(1) ').type('New Milestone');
    cy.get('form > :nth-child(2) ').type('New milestone description');

    // Submit the form
    cy.get('button.font-medium:nth-child(2)').click();
  });
});
