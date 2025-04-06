/// <reference types="cypress" />
import { Project, Task } from '../support/interfaces';

describe('Task Management Tests', () => {
  // Set up auth state before each test
  beforeEach(() => {
    // Use custom login command
    cy.login('test@example.com', 'password123');
  });

  describe('Task List Page', () => {
    beforeEach(() => {
      // Define test project with tasks
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
          {
            id: 2,
            title: 'Task 2',
            description: 'Second task',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            dueDate: '2023-12-20',
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

      // Mock the tasks list API response
      cy.intercept('GET', '/api/projects/1/tasks', {
        statusCode: 200,
        body: testProject.tasks,
      }).as('tasksListRequest');

      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: [testProject],
      }).as('projectsListRequest');
    });

    it('should display task list correctly', () => {
      cy.visit('/project/1/task');
      cy.wait('@authCheck');
      cy.wait('@projectsListRequest');

      // Check if tasks are displayed
      cy.contains('Task 1').should('be.visible');
      cy.contains('Task 2').should('be.visible');
      cy.contains('First task').should('be.visible');
      cy.contains('Second task').should('be.visible');
    });

    it.skip('should navigate to task details when clicking on a task', () => {
      cy.visit('/project/1/task');
      cy.wait('@authCheck');

      const task: Task = {
        id: 1,
        title: 'Task 1',
        description: 'First task',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: '2023-12-15',
        projectId: 1,
        milestoneId: 1,
      };

      cy.contains(task.title).click();
      cy.url().should('include', '/project/1/task/1');
    });

    it.skip('should filter tasks by status', () => {
      cy.visit('/project/1/task');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@tasksListRequest');

      // Filter by IN_PROGRESS status
      cy.get('select[id="statusFilter"]').select('IN_PROGRESS');

      // Only Task 2 should be visible
      cy.contains('Task 2').should('be.visible');
      cy.contains('Task 1').should('not.be.visible');
    });

    it.skip('should create a new task', () => {
      cy.visit('/project/1/task');
      cy.wait('@authCheck');
      cy.wait('@projectDetailsRequest');
      cy.wait('@tasksListRequest');

      // Define a new task
      const newTask: Task = {
        id: 3,
        title: 'New Task',
        description: 'New task description',
        status: 'TODO',
        priority: 'LOW',
        dueDate: '2024-01-15',
        projectId: 1,
        milestoneId: 1,
      };

      // Mock the task creation API response
      cy.intercept('POST', '/api/projects/1/tasks', {
        statusCode: 201,
        body: newTask,
      }).as('createTaskRequest');

      // Open the create task modal
      cy.contains('button', 'Create Task').click();

      // Fill out the form
      cy.get('input[id="taskName"]').type(newTask.title);
      cy.get('textarea[id="taskDescription"]').type(newTask.description);
      cy.get('input[id="taskDueDate"]').type(newTask.dueDate);
      cy.get('select[id="taskStatus"]').select(newTask.status);
      cy.get('select[id="taskPriority"]').select(newTask.priority);
      cy.get('select[id="taskMilestoneId"]').select(String(newTask.milestoneId)); // Select the first milestone

      // Submit the form
      cy.contains('button', 'Create').click();

      // Wait for the create request
      cy.wait('@createTaskRequest');

      // Define existing tasks with new task added
      const updatedTasks: Task[] = [
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
        {
          id: 2,
          title: 'Task 2',
          description: 'Second task',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          dueDate: '2023-12-20',
          projectId: 1,
          milestoneId: 1,
        },
        newTask,
      ];

      // Mock updated tasks list
      cy.intercept('GET', '/api/projects/1/tasks', {
        statusCode: 200,
        body: updatedTasks,
      });

      // Verify the new task appears in the list
      cy.contains(newTask.title).should('be.visible');
      cy.contains(newTask.description).should('be.visible');
      cy.contains(newTask.priority).should('be.visible');
    });
  });

  describe('Task Details Page', () => {
    beforeEach(() => {
      // Define test project with tasks
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

      // Mock the task details API response
      cy.intercept('GET', '/api/projects/1/tasks/1', {
        statusCode: 200,
        body: testProject.tasks[0],
      }).as('taskDetailsRequest');
    });

    it.skip('should display task details correctly', () => {
      cy.visit('/project/1/task/1');
      cy.wait('@projectDetailsRequest');
      cy.wait('@taskDetailsRequest');

      // Check task details are displayed
      cy.contains('Task 1').should('be.visible');
      cy.contains('First task').should('be.visible');
      cy.contains('TODO').should('be.visible');
      cy.contains('HIGH').should('be.visible');
      cy.contains('2023-12-15').should('be.visible');
      cy.contains('Milestone 1').should('be.visible');
    });

    it.skip('should edit task details', () => {
      cy.visit('/project/1/task/1');
      cy.wait('@projectDetailsRequest');
      cy.wait('@taskDetailsRequest');

      // Define updated task
      const updatedTask: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated task description',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: '2024-01-30',
        projectId: 1,
        milestoneId: 1,
      };

      // Mock the task update API response
      cy.intercept('PUT', '/api/projects/1/tasks/1', {
        statusCode: 200,
        body: updatedTask,
      }).as('updateTaskRequest');

      // Click edit button
      cy.contains('button', 'Edit Task').click();

      // Update form fields
      cy.get('input[id="taskName"]')
        .clear()
        .type(updatedTask.title);
      cy.get('textarea[id="taskDescription"]')
        .clear()
        .type(updatedTask.description);
      cy.get('input[id="taskDueDate"]')
        .clear()
        .type(updatedTask.dueDate);
      cy.get('select[id="taskStatus"]').select(updatedTask.status);
      cy.get('select[id="taskPriority"]').select(updatedTask.priority);

      // Submit the form
      cy.contains('button', 'Update').click();

      // Wait for the update request
      cy.wait('@updateTaskRequest');

      // Verify updated details are displayed
      cy.contains(updatedTask.title).should('be.visible');
      cy.contains(updatedTask.description).should('be.visible');
      cy.contains(updatedTask.status).should('be.visible');
      cy.contains(updatedTask.priority).should('be.visible');
      cy.contains(updatedTask.dueDate).should('be.visible');
    });

    it.skip('should change task status quickly using status dropdown', () => {
      cy.visit('/project/1/task/1');
      cy.wait('@projectDetailsRequest');
      cy.wait('@taskDetailsRequest');

      // Define status changed task
      const statusChangedTask: Task = {
        id: 1,
        title: 'Task 1',
        description: 'First task',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: '2023-12-15',
        projectId: 1,
        milestoneId: 1,
      };

      // Mock the task update API response
      cy.intercept('PUT', '/api/projects/1/tasks/1', {
        statusCode: 200,
        body: statusChangedTask,
      }).as('updateTaskStatusRequest');

      // Change status using the quick status dropdown
      cy.get('select[id="quickStatusChange"]').select('COMPLETED');

      // Wait for the update request
      cy.wait('@updateTaskStatusRequest');

      // Verify the status has been updated
      cy.contains('COMPLETED').should('be.visible');
    });

    it.skip('should delete a task', () => {
      cy.visit('/project/1/task/1');
      cy.wait('@projectDetailsRequest');
      cy.wait('@taskDetailsRequest');

      // Mock the task delete API response
      cy.intercept('DELETE', '/api/projects/1/tasks/1', {
        statusCode: 200,
      }).as('deleteTaskRequest');

      // Click delete button and confirm
      cy.contains('button', 'Delete Task').click();
      cy.contains('button', 'Confirm').click();

      // Wait for the delete request
      cy.wait('@deleteTaskRequest');

      // Should redirect to tasks list
      cy.url().should('include', '/project/1/task');
      cy.url().should('not.include', '/task/1');
    });
  });
});
