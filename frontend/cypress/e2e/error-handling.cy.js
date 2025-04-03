describe("Error Handling and Edge Cases", () => {
  beforeEach(() => {
    // Log in before each test
    cy.login("test@example.com", "password123");
  });

  describe("API Error Handling", () => {
    it("should handle server error when loading projects", () => {
      // Mock server error for projects API
      cy.intercept("GET", "/api/projects", {
        statusCode: 500,
        body: {
          message: "Internal server error",
        },
      }).as("projectsError");

      // Visit projects page
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@projectsError");

      // Should display error message
      cy.contains("Failed to load projects").should("be.visible");
      cy.contains("Please try again later").should("be.visible");
    });

    it("should handle not found error when accessing non-existent project", () => {
      // Mock 404 error for project API
      cy.intercept("GET", "/api/projects/9999", {
        statusCode: 404,
        body: {
          message: "Project not found",
        },
      }).as("projectNotFound");

      // Visit non-existent project page
      cy.visit("/project/9999");
      cy.wait("@authCheck");
      cy.wait("@projectNotFound");

      // Should display not found message
      cy.contains("Project not found").should("be.visible");
      cy.contains("back to projects").should("be.visible");
    });

    it("should handle unauthorized error when token expires", () => {
      // Mock authenticated user first
      cy.visit("/project");
      cy.wait("@authCheck");

      // Then mock token expiration on next request
      cy.intercept("GET", "/api/projects", {
        statusCode: 401,
        body: {
          message: "Unauthorized",
        },
      }).as("unauthorizedError");

      // Mock failed refresh token attempt
      cy.intercept("GET", "/api/auth/refresh", {
        statusCode: 401,
        body: {
          message: "Refresh token expired",
        },
      }).as("refreshFailed");

      // Trigger unauthorized error
      cy.contains("Projects").click();
      cy.wait("@unauthorizedError");

      // Should redirect to login
      cy.url().should("include", "/login");

      // Should show session expired message
      cy.contains("Your session has expired").should("be.visible");
    });
  });

  describe("Form Validation", () => {
    it("should validate required fields when creating project", () => {
      // Mock projects list
      cy.mockProjects();

      // Visit projects page
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@projectsListRequest");

      // Open create project modal
      cy.contains("button", "Create Project").click();

      // Try to submit empty form
      cy.contains("button", "Create").click();

      // Should show validation errors
      cy.contains("Project name is required").should("be.visible");
    });

    it("should validate task dates when creating task", () => {
      // Mock project data
      cy.mockProjectDetails(1);

      // Visit project details page
      cy.visit("/project/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");

      // Navigate to tasks
      cy.intercept("GET", "/api/projects/1/tasks", {
        statusCode: 200,
        body: [],
      }).as("tasksRequest");

      cy.contains("View Tasks").click();
      cy.wait("@tasksRequest");

      // Open create task modal
      cy.contains("button", "Create Task").click();

      // Fill out the form with past due date
      cy.get('input[id="taskName"]').type("Test Task");
      cy.get('textarea[id="taskDescription"]').type("Task description");

      // Set past due date (30 days ago)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      const formattedPastDate = pastDate.toISOString().split("T")[0];
      cy.get('input[id="taskDueDate"]').type(formattedPastDate);

      cy.get('select[id="taskStatus"]').select("TODO");
      cy.get('select[id="taskPriority"]').select("MEDIUM");
      cy.get('select[id="taskMilestoneId"]').select("1");

      // Submit the form
      cy.contains("button", "Create").click();

      // Should show validation warning about past date
      cy.contains("Warning: Due date is in the past").should("be.visible");
    });
  });

  describe("Empty States", () => {
    it("should display empty state message for project list", () => {
      // Mock empty projects list
      cy.intercept("GET", "/api/projects", {
        statusCode: 200,
        body: [],
      }).as("emptyProjectsList");

      // Visit projects page
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@emptyProjectsList");

      // Should display empty state
      cy.contains("No projects found").should("be.visible");
      cy.contains("Create your first project").should("be.visible");
    });

    it("should display empty state message for tasks list", () => {
      // Mock project with no tasks
      cy.intercept("GET", "/api/projects/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Empty Project",
          description: "Project with no tasks",
          status: "PLANNED",
          milestones: [],
          tasks: [],
        },
      }).as("emptyProject");

      // Mock empty tasks list
      cy.intercept("GET", "/api/projects/1/tasks", {
        statusCode: 200,
        body: [],
      }).as("emptyTasksList");

      // Visit tasks page
      cy.visit("/project/1/task");
      cy.wait("@authCheck");
      cy.wait("@emptyProject");
      cy.wait("@emptyTasksList");

      // Should display empty state
      cy.contains("No tasks found").should("be.visible");
      cy.contains("Create your first task").should("be.visible");
    });
  });

  describe("Network Error Handling", () => {
    it("should handle network disconnection", () => {
      // Mock projects data
      cy.mockProjects();

      // Visit projects page
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@projectsListRequest");

      // Simulate network error on project creation
      cy.intercept("POST", "/api/projects", {
        forceNetworkError: true,
      }).as("networkError");

      // Open create project modal
      cy.contains("button", "Create Project").click();

      // Fill out the form
      cy.get('input[id="projectName"]').type("New Project");
      cy.get('textarea[id="projectDescription"]').type(
        "New project description"
      );
      cy.get('select[id="projectStatus"]').select("PLANNED");

      // Submit the form
      cy.contains("button", "Create").click();

      // Should show network error message
      cy.contains("Network error").should("be.visible");
      cy.contains("Please check your connection").should("be.visible");
    });

    it("should retry loading data after temporary error", () => {
      // First request fails
      cy.intercept("GET", "/api/projects", {
        statusCode: 503,
        body: {
          message: "Service temporarily unavailable",
        },
      }).as("serviceUnavailable");

      // Visit projects page
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@serviceUnavailable");

      // Should display temporary error
      cy.contains("Service temporarily unavailable").should("be.visible");

      // Mock successful retry response
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
        ],
      }).as("retrySuccess");

      // Click retry button
      cy.contains("button", "Retry").click();
      cy.wait("@retrySuccess");

      // Should display project data
      cy.contains("Test Project 1").should("be.visible");
    });
  });
});
