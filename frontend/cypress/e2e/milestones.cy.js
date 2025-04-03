describe("Milestone Management Tests", () => {
  // Set up auth state before each test
  beforeEach(() => {
    // Mock the authenticated user
    cy.intercept("GET", "/api/auth/user", {
      statusCode: 200,
      body: {
        authenticated: true,
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
    }).as("authCheck");

    // Set fake tokens in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("accessToken", "fake-access-token");
      win.localStorage.setItem("refreshToken", "fake-refresh-token");
    });
  });

  describe("Milestone List Page", () => {
    beforeEach(() => {
      // Mock the project details API response
      cy.intercept("GET", "/api/projects/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Test Project",
          description: "Project description",
          status: "IN_PROGRESS",
          milestones: [
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
              dueDate: "2024-01-31",
              status: "PLANNED",
              projectId: 1,
            },
          ],
          tasks: [],
        },
      }).as("projectDetailsRequest");

      // Mock the milestones list API response
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
          {
            id: 2,
            name: "Milestone 2",
            description: "Second milestone",
            dueDate: "2024-01-31",
            status: "PLANNED",
            projectId: 1,
          },
        ],
      }).as("milestonesListRequest");
    });

    it("should display milestone list correctly", () => {
      cy.visit("/project/1/milestone");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@milestonesListRequest");

      // Check if milestones are displayed
      cy.contains("Milestone 1").should("be.visible");
      cy.contains("Milestone 2").should("be.visible");
      cy.contains("First milestone").should("be.visible");
      cy.contains("Second milestone").should("be.visible");
    });

    it("should navigate to milestone details when clicking on a milestone", () => {
      cy.visit("/project/1/milestone");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@milestonesListRequest");

      // Mock the milestone details API response
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

      // Click on the first milestone
      cy.contains("Milestone 1").click();

      // Should navigate to milestone details page
      cy.url().should("include", "/project/1/milestone/1");
    });

    it("should create a new milestone", () => {
      cy.visit("/project/1/milestone");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@milestonesListRequest");

      // Mock the milestone creation API response
      cy.intercept("POST", "/api/projects/1/milestones", {
        statusCode: 201,
        body: {
          id: 3,
          name: "New Milestone",
          description: "New milestone description",
          dueDate: "2024-02-28",
          status: "PLANNED",
          projectId: 1,
        },
      }).as("createMilestoneRequest");

      // Open the create milestone modal
      cy.contains("button", "Create Milestone").click();

      // Fill out the form
      cy.get('input[id="milestoneName"]').type("New Milestone");
      cy.get('textarea[id="milestoneDescription"]').type(
        "New milestone description"
      );
      cy.get('input[id="milestoneDueDate"]').type("2024-02-28");
      cy.get('select[id="milestoneStatus"]').select("PLANNED");

      // Submit the form
      cy.contains("button", "Create").click();

      // Wait for the create request
      cy.wait("@createMilestoneRequest");

      // Mock updated milestones list
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
          {
            id: 2,
            name: "Milestone 2",
            description: "Second milestone",
            dueDate: "2024-01-31",
            status: "PLANNED",
            projectId: 1,
          },
          {
            id: 3,
            name: "New Milestone",
            description: "New milestone description",
            dueDate: "2024-02-28",
            status: "PLANNED",
            projectId: 1,
          },
        ],
      });

      // Verify the new milestone appears in the list
      cy.contains("New Milestone").should("be.visible");
      cy.contains("New milestone description").should("be.visible");
    });
  });

  describe("Milestone Details Page", () => {
    beforeEach(() => {
      // Mock the project details API response
      cy.intercept("GET", "/api/projects/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Test Project",
          description: "Project description",
          status: "IN_PROGRESS",
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
      }).as("projectDetailsRequest");

      // Mock the milestone details API response
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

      // Mock the milestone tasks API response
      cy.intercept("GET", "/api/projects/1/milestones/1/tasks", {
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
      }).as("milestoneTasksRequest");
    });

    it("should display milestone details correctly", () => {
      cy.visit("/project/1/milestone/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@milestoneDetailsRequest");

      // Check milestone details are displayed
      cy.contains("Milestone 1").should("be.visible");
      cy.contains("First milestone").should("be.visible");
      cy.contains("2023-12-31").should("be.visible");
      cy.contains("IN_PROGRESS").should("be.visible");
    });

    it("should display related tasks for the milestone", () => {
      cy.visit("/project/1/milestone/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@milestoneDetailsRequest");
      cy.wait("@milestoneTasksRequest");

      // Check related tasks are displayed
      cy.contains("Task 1").should("be.visible");
      cy.contains("First task").should("be.visible");
    });

    it("should edit milestone details", () => {
      cy.visit("/project/1/milestone/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@milestoneDetailsRequest");

      // Mock the milestone update API response
      cy.intercept("PUT", "/api/projects/1/milestones/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Updated Milestone",
          description: "Updated milestone description",
          dueDate: "2024-03-15",
          status: "COMPLETED",
          projectId: 1,
        },
      }).as("updateMilestoneRequest");

      // Click edit button
      cy.contains("button", "Edit Milestone").click();

      // Update form fields
      cy.get('input[id="milestoneName"]').clear().type("Updated Milestone");
      cy.get('textarea[id="milestoneDescription"]')
        .clear()
        .type("Updated milestone description");
      cy.get('input[id="milestoneDueDate"]').clear().type("2024-03-15");
      cy.get('select[id="milestoneStatus"]').select("COMPLETED");

      // Submit the form
      cy.contains("button", "Update").click();

      // Wait for the update request
      cy.wait("@updateMilestoneRequest");

      // Verify updated details are displayed
      cy.contains("Updated Milestone").should("be.visible");
      cy.contains("Updated milestone description").should("be.visible");
      cy.contains("2024-03-15").should("be.visible");
      cy.contains("COMPLETED").should("be.visible");
    });

    it("should delete a milestone", () => {
      cy.visit("/project/1/milestone/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@milestoneDetailsRequest");

      // Mock the milestone delete API response
      cy.intercept("DELETE", "/api/projects/1/milestones/1", {
        statusCode: 200,
      }).as("deleteMilestoneRequest");

      // Click delete button and confirm
      cy.contains("button", "Delete Milestone").click();
      cy.contains("button", "Confirm").click();

      // Wait for the delete request
      cy.wait("@deleteMilestoneRequest");

      // Should redirect to milestones list
      cy.url().should("include", "/project/1/milestone");
      cy.url().should("not.include", "/milestone/1");
    });
  });
});
