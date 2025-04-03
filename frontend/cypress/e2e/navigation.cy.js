describe("Navigation and Redirect Tests", () => {
  describe("Unauthenticated Navigation", () => {
    beforeEach(() => {
      // Clear auth tokens
      cy.clearLocalStorage();

      // Mock unauthenticated user
      cy.intercept("GET", "/api/auth/user", {
        statusCode: 200,
        body: {
          authenticated: false,
        },
      }).as("authCheck");
    });

    it("should redirect to login when accessing protected route", () => {
      // Try to access projects page without auth
      cy.visit("/project");
      cy.wait("@authCheck");

      // Should redirect to login page
      cy.url().should("include", "/login");
    });

    it("should allow access to public routes", () => {
      // Visit login page
      cy.visit("/login");
      cy.wait("@authCheck");

      // Should stay on login page
      cy.url().should("include", "/login");
      cy.contains("Welcome Back").should("be.visible");

      // Visit register page
      cy.visit("/register");
      cy.wait("@authCheck");

      // Should stay on register page
      cy.url().should("include", "/register");
      cy.contains("Create Account").should("be.visible");
    });

    it("should save the redirect path when accessing protected route", () => {
      // Try to access a specific project page
      cy.visit("/project/1");
      cy.wait("@authCheck");

      // Should redirect to login with state preserved
      cy.url().should("include", "/login");

      // Log in
      cy.login("test@example.com", "password123");
      cy.mockProjectDetails(1);

      // Click login button (mocking successful login)
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("password123");
      cy.contains("button", "Sign in").click();
      cy.wait("@loginRequest");

      // Should redirect back to the original URL
      cy.url().should("include", "/project/1");
    });
  });

  describe("Authenticated Navigation", () => {
    beforeEach(() => {
      // Log in before each test
      cy.login("test@example.com", "password123");
    });

    it("should navigate through the navbar links", () => {
      // Mock required data
      cy.mockProjects();

      // Visit the home page
      cy.visit("/");
      cy.wait("@authCheck");

      // Should redirect to projects page
      cy.url().should("include", "/project");

      // Click on profile link in navbar
      cy.contains("User Profile").click();
      cy.url().should("include", "/profile");

      // Click on projects link in navbar
      cy.contains("Projects").click();
      cy.url().should("include", "/project");
      cy.url().should("not.include", "/profile");
    });

    it("should navigate through project hierarchy", () => {
      // Mock project data
      cy.mockProjects();
      cy.mockProjectDetails(1);

      // Visit projects page
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@projectsListRequest");

      // Click on a project
      cy.contains("Test Project 1").click();
      cy.wait("@projectDetailsRequest");
      cy.url().should("include", "/project/1");

      // Mock milestone data
      cy.intercept("GET", "/api/projects/1/milestones", {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: "Milestone 1",
            description: "First milestone",
            dueDate: "2023-12-31",
            status: "IN_PROGRESS",
            projectId: 1,
          },
        ],
      }).as("milestonesRequest");

      // Click on milestones
      cy.contains("View Milestones").click();
      cy.url().should("include", "/project/1/milestone");

      // Click on a milestone
      cy.intercept("GET", "/api/projects/1/milestones/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Milestone 1",
          description: "First milestone",
          dueDate: "2023-12-31",
          status: "IN_PROGRESS",
          projectId: 1,
        },
      }).as("milestoneDetailsRequest");

      cy.contains("Milestone 1").click();
      cy.url().should("include", "/project/1/milestone/1");

      // Navigate back to project
      cy.contains("Back to Project").click();
      cy.url().should("include", "/project/1");
      cy.url().should("not.include", "/milestone");

      // Mock tasks data
      cy.intercept("GET", "/api/projects/1/tasks", {
        statusCode: 200,
        body: [
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
        ],
      }).as("tasksRequest");

      // Click on tasks
      cy.contains("View Tasks").click();
      cy.url().should("include", "/project/1/task");

      // Click on a task
      cy.intercept("GET", "/api/projects/1/tasks/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Task 1",
          description: "First task",
          status: "TODO",
          priority: "HIGH",
          dueDate: "2023-12-15",
          projectId: 1,
          milestoneId: 1,
        },
      }).as("taskDetailsRequest");

      cy.contains("Task 1").click();
      cy.url().should("include", "/project/1/task/1");

      // Navigate back to tasks
      cy.contains("Back to Tasks").click();
      cy.url().should("include", "/project/1/task");
      cy.url().should("not.include", "/task/1");

      // Navigate back to projects list
      cy.contains("Back to Projects").click();
      cy.url().should("include", "/project");
      cy.url().should("not.include", "/project/1");
    });

    it("should log out and redirect to login page", () => {
      cy.mockProjects();

      // Visit projects page
      cy.visit("/project");
      cy.wait("@authCheck");

      // Mock logout API response
      cy.intercept("POST", "/api/auth/logout", {
        statusCode: 200,
      }).as("logoutRequest");

      // Click logout in navbar
      cy.contains("Logout").click();
      cy.wait("@logoutRequest");

      // Should redirect to login page
      cy.url().should("include", "/login");

      // Verify logged out state
      cy.window().then((win) => {
        expect(win.localStorage.getItem("accessToken")).to.be.null;
      });
    });
  });
});
