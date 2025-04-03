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

import { User, Project, Milestone, Task as ProjectTask } from "./interfaces";

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      mockProjects(projects?: Project[]): Chainable<void>;
      mockProjectDetails(project: Project | number): Chainable<void>;
      mockMilestones(milestones?: Milestone[]): Chainable<void>;
      mockMilestoneDetails(milestone?: Milestone): Chainable<void>;
      mockTasks(tasks?: ProjectTask[]): Chainable<void>;
      mockTaskDetails(task?: ProjectTask): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}

// -- This is a parent command --
Cypress.Commands.add(
  "login",
  (email: string = "test@example.com", password: string = "password123") => {
    // Mock authentication
    const user: User = {
      authenticated: true,
      id: 1,
      name: "Test User",
      email,
      accessToken: "fake-access-token",
      refreshToken: "fake-refresh-token",
    };

    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: user,
    }).as("loginRequest");

    // Set tokens in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("accessToken", "fake-access-token");
      win.localStorage.setItem("refreshToken", "fake-refresh-token");
    });

    // Mock authenticated user
    cy.intercept("GET", "/api/auth/user", {
      statusCode: 200,
      body: user,
    }).as("authCheck");
  }
);

// Mock project data for testing
Cypress.Commands.add("mockProjects", (projects?: Project[]) => {
  // Default projects if none provided
  const defaultProjects: Project[] = [
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
  ];

  cy.intercept("GET", "/api/projects", {
    statusCode: 200,
    body: projects || defaultProjects,
  }).as("projectsListRequest");
});

// Mock project details for testing
Cypress.Commands.add("mockProjectDetails", (project: Project | number = 1) => {
  let projectId: number;

  // Handle both project object and project ID
  if (typeof project === "number") {
    projectId = project;
  } else {
    projectId = project.id;
  }

  const projectDetails: Project = {
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
  };

  cy.intercept("GET", `/api/projects/${projectId}`, {
    statusCode: 200,
    body: projectDetails,
  }).as("projectDetailsRequest");
});

// Milestone mock commands
Cypress.Commands.add("mockMilestones", (milestones?: Milestone[]) => {
  // Default milestones if none provided
  const defaultMilestones: Milestone[] = [
    {
      id: 1,
      name: "Milestone 1",
      description: "First milestone",
      dueDate: "2023-12-31",
      status: "IN_PROGRESS",
      projectId: 1,
    },
    {
      id: 2,
      name: "Milestone 2",
      description: "Second milestone",
      dueDate: "2024-03-31",
      status: "PLANNED",
      projectId: 1,
    },
  ];

  const projectId =
    milestones && milestones.length > 0 ? milestones[0].projectId : 1;

  cy.intercept("GET", `/api/projects/${projectId}/milestones`, {
    statusCode: 200,
    body: milestones || defaultMilestones,
  }).as("milestonesRequest");
});

Cypress.Commands.add("mockMilestoneDetails", (milestone?: Milestone) => {
  // Default milestone if none provided
  const defaultMilestone: Milestone = {
    id: 1,
    name: "Milestone 1",
    description: "First milestone",
    dueDate: "2023-12-31",
    status: "IN_PROGRESS",
    projectId: 1,
  };

  const milestoneToUse = milestone || defaultMilestone;

  cy.intercept(
    "GET",
    `/api/projects/${milestoneToUse.projectId}/milestones/${milestoneToUse.id}`,
    {
      statusCode: 200,
      body: milestoneToUse,
    }
  ).as("milestoneDetailsRequest");
});

// Task mock commands
Cypress.Commands.add("mockTasks", (tasks?: ProjectTask[]) => {
  // Default tasks if none provided
  const defaultTasks: ProjectTask[] = [
    {
      id: 1,
      name: "Task 1",
      description: "First task",
      status: "TODO",
      priority: "HIGH",
      dueDate: "2023-12-15",
      projectId: 1,
      milestoneId: 1,
    },
    {
      id: 2,
      name: "Task 2",
      description: "Second task",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDate: "2023-12-20",
      projectId: 1,
    },
  ];

  const projectId = tasks && tasks.length > 0 ? tasks[0].projectId : 1;

  cy.intercept("GET", `/api/projects/${projectId}/tasks`, {
    statusCode: 200,
    body: tasks || defaultTasks,
  }).as("tasksRequest");
});

Cypress.Commands.add("mockTaskDetails", (task?: ProjectTask) => {
  // Default task if none provided
  const defaultTask: ProjectTask = {
    id: 1,
    name: "Task 1",
    description: "First task",
    status: "TODO",
    priority: "HIGH",
    dueDate: "2023-12-15",
    projectId: 1,
    milestoneId: 1,
  };

  const taskToUse = task || defaultTask;

  cy.intercept(
    "GET",
    `/api/projects/${taskToUse.projectId}/tasks/${taskToUse.id}`,
    {
      statusCode: 200,
      body: taskToUse,
    }
  ).as("taskDetailsRequest");
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
