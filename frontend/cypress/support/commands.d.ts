/// <reference types="cypress" />
import { User, Project, Milestone, Task } from './interfaces';

// To avoid the type conflict between the custom Task interface and Cypress.Task
declare namespace Cypress {
  // Explicitly extend the Cypress namespace to add our custom interfaces
  interface Chainable<Subject = any> {
    /**
     * Custom command to simulate user login
     * @example cy.login('test@example.com', 'password123')
     */
    login(email?: string, password?: string): void;

    /**
     * Custom command to mock projects API response
     * @example cy.mockProjects([...projects])
     */
    mockProjects(projects?: Project[]): void;

    /**
     * Custom command to mock project details API response
     * @example cy.mockProjectDetails(projectId)
     * @example cy.mockProjectDetails(project)
     */
    mockProjectDetails(project: Project | number): void;

    /**
     * Custom command to mock milestones API response
     * @example cy.mockMilestones([...milestones])
     */
    mockMilestones(milestones?: Milestone[]): void;

    /**
     * Custom command to mock milestone details API response
     * @example cy.mockMilestoneDetails(milestone)
     */
    mockMilestoneDetails(milestone?: Milestone): void;

    /**
     * Custom command to mock tasks API response
     * @example cy.mockTasks([...tasks])
     */
    mockTasks(tasks?: Task[]): void;

    /**
     * Custom command to mock task details API response
     * @example cy.mockTaskDetails(task)
     */
    mockTaskDetails(task?: Task): void;

    /**
     * Custom command to log out the user
     * @example cy.logout()
     */
    logout(): void;
  }
}
