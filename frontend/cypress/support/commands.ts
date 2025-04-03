/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): void;
    mockProjects(): void;
    mockProjectDetails(projectId?: number): void;
    logout(): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add("login", (email: string, password: string) => {
  // Mock authentication
  cy.intercept("POST", "/api/auth/login", {
    statusCode: 200,
    body: {
      authenticated: true,
      id: 1,
      name: "Test User",
      email,
      accessToken: "fake-access-token",
      refreshToken: "fake-refresh-token",
    },
  }).as("loginRequest");

  // Set tokens in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem("accessToken", "fake-access-token");
    win.localStorage.setItem("refreshToken", "fake-refresh-token");
  });

  // Mock authenticated user
  cy.intercept("GET", "/api/auth/user", {
    statusCode: 200,
    body: {
      authenticated: true,
      id: 1,
      name: "Test User",
      email,
    },
  }).as("authCheck");
});

// Mock project data for testing
Cypress.Commands.add("mockProjects", () => {
  cy.intercept("GET", "/api/projects", {
    statusCode: 200,
    body: [
      {
        id: 1,
        name: "Test Project 1",
        description: "Project 1 description",
        status: "IN_PROGRESS",
        milestones: [],
        tasks: [],
      },
      {
        id: 2,
        name: "Test Project 2",
        description: "Project 2 description",
        status: "PLANNED",
        milestones: [],
        tasks: [],
      },
    ],
  }).as("projectsListRequest");
});

// Mock project details for testing
Cypress.Commands.add("mockProjectDetails", (projectId: number = 1) => {
  cy.intercept("GET", `/api/projects/${projectId}`, {
    statusCode: 200,
    body: {
      id: projectId,
      name: `Test Project ${projectId}`,
      description: `Project ${projectId} description`,
      status: "IN_PROGRESS",
      milestones: [
        {
          id: 1,
          name: "Milestone 1",
          description: "First milestone",
          dueDate: "2023-12-31",
          status: "IN_PROGRESS",
          projectId,
        },
      ],
      tasks: [
        {
          id: 1,
          name: "Task 1",
          description: "First task",
          status: "TODO",
          priority: "HIGH",
          dueDate: "2023-12-15",
          projectId,
          milestoneId: 1,
        },
      ],
    },
  }).as("projectDetailsRequest");
});

// Clear storage and mock logout
Cypress.Commands.add("logout", () => {
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.intercept("POST", "/api/auth/logout", {
    statusCode: 200,
  }).as("logoutRequest");
});
