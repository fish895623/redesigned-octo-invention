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
          tasks: [],
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
    cy.wait('@milestonesListRequest');
    cy.get('li[role="listitem"]').should('have.length', 2);
  });

  it.skip('should display milestone details', () => {
    cy.get('li[role="listitem"]')
      .first()
      .click();
    cy.wait('@milestoneDetailsRequest');
    cy.get('article[role="article"]').within(() => {
      cy.contains('p', 'First milestone').should('be.visible');
      cy.contains('time', '2023-12-31').should('be.visible');
    });
  });

  it.skip('should create a new milestone', () => {
    const newMilestone = {
      title: 'New Milestone',
      description: 'New milestone description',
      dueDate: '2024-02-28',
      projectId: 1,
    };

    cy.contains('button', /create|add|new/i).click();
    cy.get('form').within(() => {
      cy.get('input[name="title"]').type(newMilestone.title);
      cy.get('textarea[name="description"]').type(newMilestone.description);
      cy.get('input[type="date"]').type(newMilestone.dueDate);
      cy.get('button[type="submit"]').click();
    });

    cy.wait('@createMilestoneRequest').then((interception) => {
      expect(interception.request.body).to.deep.include(newMilestone);
    });
    cy.contains('h3', 'New Milestone').should('be.visible');
  });

  it.skip('should update a milestone', () => {
    cy.get('li[role="listitem"]')
      .first()
      .click();
    cy.wait('@milestoneDetailsRequest');

    cy.contains('button', /edit/i).click();
    cy.get('form').within(() => {
      cy.get('input[name="title"]')
        .clear()
        .type('Updated Milestone');
      cy.get('textarea[name="description"]')
        .clear()
        .type('Updated description');
      cy.get('button[type="submit"]').click();
    });

    cy.wait('@updateMilestoneRequest');
    cy.contains('h3', 'Updated Milestone').should('be.visible');
  });

  it.skip('should delete a milestone', () => {
    cy.get('li[role="listitem"]')
      .first()
      .click();
    cy.wait('@milestoneDetailsRequest');

    cy.contains('button', /delete/i).click();
    cy.get('dialog[role="alertdialog"]').within(() => {
      cy.contains('button', /confirm|yes|delete/i).click();
    });

    cy.wait('@deleteMilestoneRequest');
    cy.get('li[role="listitem"]').should('have.length', 1);
  });

  it.skip('should handle milestone creation validation', () => {
    cy.contains('button', /create|add|new/i).click();
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();

      // Check validation messages using aria-invalid attributes
      cy.get('input[name="title"][aria-invalid="true"]')
        .next('span[role="alert"]')
        .should('be.visible');
      cy.get('textarea[name="description"][aria-invalid="true"]')
        .next('span[role="alert"]')
        .should('be.visible');
      cy.get('input[type="date"][aria-invalid="true"]')
        .next('span[role="alert"]')
        .should('be.visible');
    });
  });

  it.skip('should handle API errors gracefully', () => {
    // Override the milestone list API to return an error
    cy.intercept('GET', '/api/projects/1/milestones', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('milestonesListError');

    cy.visit('/projects/1/milestones');
    cy.wait('@milestonesListError');
    cy.get('[role="alert"]').should('be.visible');
  });
});
