/// <reference types="cypress" />
import { Milestone, Project } from '../support/interfaces';

describe('Milestone Management Tests', () => {
  // Set up auth state before each test
  beforeEach(() => {
    // Use custom login command
    cy.login('test@example.com', 'password123');
  });

  describe('Milestone List Page', () => {
    beforeEach(() => {
      // Define test project with milestones
      const testProject: Project = {
        id: 1,
        title: 'Test Project',
        description: 'Project description',
        status: 'IN_PROGRESS',
        milestones: [
          {
            id: 1,
            title: 'Milestone 1',
            description: 'First milestone',
            dueDate: '2023-12-31',
            status: 'IN_PROGRESS',
            projectId: 1,
          },
          {
            id: 2,
            title: 'Milestone 2',
            description: 'Second milestone',
            dueDate: '2024-01-31',
            status: 'PLANNED',
            projectId: 1,
          },
        ],
        tasks: [],
      };

      // Mock the project details API response
      cy.intercept('GET', '/api/projects/1', {
        statusCode: 200,
        body: testProject,
      }).as('projectDetailsRequest');

      // Mock the milestones list API response
      cy.intercept('GET', '/api/projects/1/milestones', {
        statusCode: 200,
        body: testProject.milestones,
      }).as('milestonesListRequest');
    });

    it('should display milestone list correctly', () => {
      cy.visit('/project/1/milestone');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@milestonesListRequest');

      // Check if milestones are displayed
      cy.contains('Milestone 1').should('be.visible');
      cy.contains('Milestone 2').should('be.visible');
      cy.contains('First milestone').should('be.visible');
      cy.contains('Second milestone').should('be.visible');
    });

    it('should navigate to milestone details when clicking on a milestone', () => {
      cy.visit('/project/1/milestone');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@milestonesListRequest');

      // Define milestone details
      const milestone: Milestone = {
        id: 1,
        title: 'Milestone 1',
        description: 'First milestone',
        dueDate: '2023-12-31',
        status: 'IN_PROGRESS',
        projectId: 1,
      };

      // Mock the milestone details API response
      cy.intercept('GET', '/api/projects/1/milestones/1', {
        statusCode: 200,
        body: milestone,
      }).as('milestoneDetailsRequest');

      // Click on the first milestone
      cy.contains('Milestone 1').click();

      // Should navigate to milestone details page
      cy.url().should('include', '/project/1/milestone/1');
    });

    it('should create a new milestone', () => {
      cy.visit('/project/1/milestone');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@milestonesListRequest');

      // Define a new milestone
      const newMilestone: Milestone = {
        id: 3,
        title: 'New Milestone',
        description: 'New milestone description',
        dueDate: '2024-02-28',
        status: 'PLANNED',
        projectId: 1,
      };

      // Mock the milestone creation API response
      cy.intercept('POST', '/api/projects/1/milestones', {
        statusCode: 201,
        body: newMilestone,
      }).as('createMilestoneRequest');

      // Open the create milestone modal
      cy.contains('button', 'Create Milestone').click();

      // Fill out the form
      cy.get('input[id="milestoneTitle"]').type(newMilestone.title);
      cy.get('textarea[id="milestoneDescription"]').type(newMilestone.description);
      cy.get('input[id="milestoneDueDate"]').type(newMilestone.dueDate);
      cy.get('select[id="milestoneStatus"]').select(newMilestone.status);

      // Submit the form
      cy.contains('button', 'Create').click();

      // Wait for the create request
      cy.wait('@createMilestoneRequest');

      // Mock updated milestones list
      cy.intercept('GET', '/api/projects/1/milestones', {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Milestone 1',
            description: 'First milestone',
            dueDate: '2023-12-31',
            status: 'IN_PROGRESS',
            projectId: 1,
          },
          {
            id: 2,
            name: 'Milestone 2',
            description: 'Second milestone',
            dueDate: '2024-01-31',
            status: 'PLANNED',
            projectId: 1,
          },
          newMilestone,
        ],
      });

      // Verify the new milestone appears in the list
      cy.contains(newMilestone.title).should('be.visible');
      cy.contains(newMilestone.description).should('be.visible');
    });
  });

  describe('Milestone Details Page', () => {
    beforeEach(() => {
      // Define test project with a milestone and task
      const testProject: Project = {
        id: 1,
        title: 'Test Project',
        description: 'Project description',
        status: 'IN_PROGRESS',
        milestones: [
          {
            id: 1,
            title: 'Milestone 1',
            description: 'First milestone',
            dueDate: '2023-12-31',
            status: 'IN_PROGRESS',
            projectId: 1,
          },
        ],
        tasks: [
          {
            id: 1,
            title: 'Task 1',
            description: 'First task',
            status: 'TODO',
            priority: 'HIGH',
            dueDate: '2023-12-15',
            projectId: 1,
            milestoneId: 1,
          },
        ],
      };

      // Mock the project details API response
      cy.intercept('GET', '/api/projects/1', {
        statusCode: 200,
        body: testProject,
      }).as('projectDetailsRequest');

      // Mock the milestone details API response
      cy.intercept('GET', '/api/projects/1/milestones/1', {
        statusCode: 200,
        body: testProject.milestones[0],
      }).as('milestoneDetailsRequest');

      // Mock the milestone tasks API response
      cy.intercept('GET', '/api/projects/1/milestones/1/tasks', {
        statusCode: 200,
        body: testProject.tasks,
      }).as('milestoneTasksRequest');
    });

    it('should display milestone details correctly', () => {
      cy.visit('/project/1/milestone/1');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@milestoneDetailsRequest');

      // Check milestone details are displayed
      cy.contains('Milestone 1').should('be.visible');
      cy.contains('First milestone').should('be.visible');
      cy.contains('2023-12-31').should('be.visible');
      cy.contains('IN_PROGRESS').should('be.visible');
    });

    it('should display related tasks for the milestone', () => {
      cy.visit('/project/1/milestone/1');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@milestoneDetailsRequest');
      cy.wait('@milestoneTasksRequest');

      // Check related tasks are displayed
      cy.contains('Task 1').should('be.visible');
      cy.contains('First task').should('be.visible');
    });

    it('should edit milestone details', () => {
      cy.visit('/project/1/milestone/1');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@milestoneDetailsRequest');

      // Define updated milestone
      const updatedMilestone: Milestone = {
        id: 1,
        title: 'Updated Milestone',
        description: 'Updated milestone description',
        dueDate: '2024-03-15',
        status: 'COMPLETED',
        projectId: 1,
      };

      // Mock the milestone update API response
      cy.intercept('PUT', '/api/projects/1/milestones/1', {
        statusCode: 200,
        body: updatedMilestone,
      }).as('updateMilestoneRequest');

      // Click edit button
      cy.contains('button', 'Edit Milestone').click();

      // Update form fields
      cy.get('input[id="milestoneName"]')
        .clear()
        .type(updatedMilestone.title);
      cy.get('textarea[id="milestoneDescription"]')
        .clear()
        .type(updatedMilestone.description);
      cy.get('input[id="milestoneDueDate"]')
        .clear()
        .type(updatedMilestone.dueDate);
      cy.get('select[id="milestoneStatus"]').select(updatedMilestone.status);

      // Submit the form
      cy.contains('button', 'Update').click();

      // Wait for the update request
      cy.wait('@updateMilestoneRequest');

      // Verify updated details are displayed
      cy.contains(updatedMilestone.title).should('be.visible');
      cy.contains(updatedMilestone.description).should('be.visible');
      cy.contains(updatedMilestone.dueDate).should('be.visible');
      cy.contains(updatedMilestone.status).should('be.visible');
    });

    it('should delete a milestone', () => {
      cy.visit('/project/1/milestone/1');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@milestoneDetailsRequest');

      // Mock the milestone delete API response
      cy.intercept('DELETE', '/api/projects/1/milestones/1', {
        statusCode: 200,
      }).as('deleteMilestoneRequest');

      // Click delete button and confirm
      cy.contains('button', 'Delete Milestone').click();
      cy.contains('button', 'Confirm').click();

      // Wait for the delete request
      cy.wait('@deleteMilestoneRequest');

      // Should redirect to milestones list
      cy.url().should('include', '/project/1/milestone');
      cy.url().should('not.include', '/milestone/1');
    });
  });
});
