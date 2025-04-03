describe("Project Management Tests", () => {
  // Set up auth state before each test
  beforeEach(() => {
    // Use custom login command
    cy.login("test@example.com", "password123");
  });

  describe("Project List Page", () => {
    beforeEach(() => {
      // Use custom mockProjects command
      cy.mockProjects();
    });

    it("should display project list correctly", () => {
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@projectsListRequest");

      // Check if projects are displayed
      cy.contains("Test Project 1").should("be.visible");
      cy.contains("Test Project 2").should("be.visible");
      cy.contains("Project 1 description").should("be.visible");
      cy.contains("Project 2 description").should("be.visible");
    });

    it("should navigate to project details when clicking on a project", () => {
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@projectsListRequest");

      // Use custom mockProjectDetails command
      cy.mockProjectDetails(1);

      // Click on the first project
      cy.contains("Test Project 1").click();

      // Should navigate to project details page
      cy.url().should("include", "/project/1");
    });

    it("should open create project modal and create a new project", () => {
      cy.visit("/project");
      cy.wait("@authCheck");
      cy.wait("@projectsListRequest");

      // Mock the project creation API response
      cy.intercept("POST", "/api/projects", {
        statusCode: 201,
        body: {
          id: 3,
          name: "New Project",
          description: "New project description",
          status: "PLANNED",
          milestones: [],
          tasks: [],
        },
      }).as("createProjectRequest");

      // Open the create project modal
      cy.contains("button", "Create Project").click();

      // Fill out the form
      cy.get('input[id="projectName"]').type("New Project");
      cy.get('textarea[id="projectDescription"]').type(
        "New project description"
      );
      cy.get('select[id="projectStatus"]').select("PLANNED");

      // Submit the form
      cy.contains("button", "Create").click();

      // Wait for the create request
      cy.wait("@createProjectRequest");

      // Mock updated project list
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
          {
            id: 3,
            name: "New Project",
            description: "New project description",
            status: "PLANNED",
            milestones: [],
            tasks: [],
          },
        ],
      });

      // Verify the new project appears in the list
      cy.contains("New Project").should("be.visible");
      cy.contains("New project description").should("be.visible");
    });
  });

  describe("Project Details Page", () => {
    beforeEach(() => {
      // Use custom mockProjectDetails command
      cy.mockProjectDetails(1);
    });

    it("should display project details correctly", () => {
      cy.visit("/project/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");

      // Check project details are displayed
      cy.contains("Test Project 1").should("be.visible");
      cy.contains("Project 1 description").should("be.visible");
      cy.contains("IN_PROGRESS").should("be.visible");
    });

    it("should navigate to milestones and tasks", () => {
      cy.visit("/project/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");

      // Mock milestones list
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

      // Navigate to milestones
      cy.contains("View Milestones").click();
      cy.url().should("include", "/project/1/milestone");

      // Navigate back to project
      cy.go("back");

      // Mock tasks list
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

      // Navigate to tasks
      cy.contains("View Tasks").click();
      cy.url().should("include", "/project/1/task");
    });

    it("should edit project details", () => {
      cy.visit("/project/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");

      // Mock the project update API response
      cy.intercept("PUT", "/api/projects/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Updated Project Name",
          description: "Updated project description",
          status: "COMPLETED",
          milestones: [
            {
              id: 1,
              name: "Milestone 1",
              description: "First milestone",
              dueDate: "2023-12-31",
              status: "IN_PROGRESS",
              projectId: 1,
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
              projectId: 1,
              milestoneId: 1,
            },
          ],
        },
      }).as("updateProjectRequest");

      // Click edit button
      cy.contains("button", "Edit Project").click();

      // Update form fields
      cy.get('input[id="projectName"]').clear().type("Updated Project Name");
      cy.get('textarea[id="projectDescription"]')
        .clear()
        .type("Updated project description");
      cy.get('select[id="projectStatus"]').select("COMPLETED");

      // Submit the form
      cy.contains("button", "Update").click();

      // Wait for the update request
      cy.wait("@updateProjectRequest");

      // Verify updated details are displayed
      cy.contains("Updated Project Name").should("be.visible");
      cy.contains("Updated project description").should("be.visible");
      cy.contains("COMPLETED").should("be.visible");
    });
  });
});
