describe("Task Management Tests", () => {
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

  describe("Task List Page", () => {
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
            {
              id: 2,
              name: "Task 2",
              description: "Second task",
              status: "IN_PROGRESS",
              priority: "MEDIUM",
              dueDate: "2023-12-20",
              projectId: 1,
              milestoneId: 1,
            },
          ],
        },
      }).as("projectDetailsRequest");

      // Mock the tasks list API response
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
          {
            id: 2,
            name: "Task 2",
            description: "Second task",
            status: "IN_PROGRESS",
            priority: "MEDIUM",
            dueDate: "2023-12-20",
            projectId: 1,
            milestoneId: 1,
          },
        ],
      }).as("tasksListRequest");
    });

    it("should display task list correctly", () => {
      cy.visit("/project/1/task");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@tasksListRequest");

      // Check if tasks are displayed
      cy.contains("Task 1").should("be.visible");
      cy.contains("Task 2").should("be.visible");
      cy.contains("First task").should("be.visible");
      cy.contains("Second task").should("be.visible");
      cy.contains("HIGH").should("be.visible");
      cy.contains("MEDIUM").should("be.visible");
    });

    it("should navigate to task details when clicking on a task", () => {
      cy.visit("/project/1/task");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@tasksListRequest");

      // Mock the task details API response
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

      // Click on the first task
      cy.contains("Task 1").click();

      // Should navigate to task details page
      cy.url().should("include", "/project/1/task/1");
    });

    it("should filter tasks by status", () => {
      cy.visit("/project/1/task");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@tasksListRequest");

      // Filter by IN_PROGRESS status
      cy.get('select[id="statusFilter"]').select("IN_PROGRESS");

      // Only Task 2 should be visible
      cy.contains("Task 2").should("be.visible");
      cy.contains("Task 1").should("not.be.visible");
    });

    it("should create a new task", () => {
      cy.visit("/project/1/task");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@tasksListRequest");

      // Mock the task creation API response
      cy.intercept("POST", "/api/projects/1/tasks", {
        statusCode: 201,
        body: {
          id: 3,
          name: "New Task",
          description: "New task description",
          status: "TODO",
          priority: "LOW",
          dueDate: "2024-01-15",
          projectId: 1,
          milestoneId: 1,
        },
      }).as("createTaskRequest");

      // Open the create task modal
      cy.contains("button", "Create Task").click();

      // Fill out the form
      cy.get('input[id="taskName"]').type("New Task");
      cy.get('textarea[id="taskDescription"]').type("New task description");
      cy.get('input[id="taskDueDate"]').type("2024-01-15");
      cy.get('select[id="taskStatus"]').select("TODO");
      cy.get('select[id="taskPriority"]').select("LOW");
      cy.get('select[id="taskMilestoneId"]').select("1"); // Select the first milestone

      // Submit the form
      cy.contains("button", "Create").click();

      // Wait for the create request
      cy.wait("@createTaskRequest");

      // Mock updated tasks list
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
          {
            id: 2,
            name: "Task 2",
            description: "Second task",
            status: "IN_PROGRESS",
            priority: "MEDIUM",
            dueDate: "2023-12-20",
            projectId: 1,
            milestoneId: 1,
          },
          {
            id: 3,
            name: "New Task",
            description: "New task description",
            status: "TODO",
            priority: "LOW",
            dueDate: "2024-01-15",
            projectId: 1,
            milestoneId: 1,
          },
        ],
      });

      // Verify the new task appears in the list
      cy.contains("New Task").should("be.visible");
      cy.contains("New task description").should("be.visible");
      cy.contains("LOW").should("be.visible");
    });
  });

  describe("Task Details Page", () => {
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

      // Mock the task details API response
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
    });

    it("should display task details correctly", () => {
      cy.visit("/project/1/task/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@taskDetailsRequest");

      // Check task details are displayed
      cy.contains("Task 1").should("be.visible");
      cy.contains("First task").should("be.visible");
      cy.contains("TODO").should("be.visible");
      cy.contains("HIGH").should("be.visible");
      cy.contains("2023-12-15").should("be.visible");
      cy.contains("Milestone 1").should("be.visible");
    });

    it("should edit task details", () => {
      cy.visit("/project/1/task/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@taskDetailsRequest");

      // Mock the task update API response
      cy.intercept("PUT", "/api/projects/1/tasks/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Updated Task",
          description: "Updated task description",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueDate: "2024-01-30",
          projectId: 1,
          milestoneId: 1,
        },
      }).as("updateTaskRequest");

      // Click edit button
      cy.contains("button", "Edit Task").click();

      // Update form fields
      cy.get('input[id="taskName"]').clear().type("Updated Task");
      cy.get('textarea[id="taskDescription"]')
        .clear()
        .type("Updated task description");
      cy.get('input[id="taskDueDate"]').clear().type("2024-01-30");
      cy.get('select[id="taskStatus"]').select("IN_PROGRESS");
      cy.get('select[id="taskPriority"]').select("MEDIUM");

      // Submit the form
      cy.contains("button", "Update").click();

      // Wait for the update request
      cy.wait("@updateTaskRequest");

      // Verify updated details are displayed
      cy.contains("Updated Task").should("be.visible");
      cy.contains("Updated task description").should("be.visible");
      cy.contains("IN_PROGRESS").should("be.visible");
      cy.contains("MEDIUM").should("be.visible");
      cy.contains("2024-01-30").should("be.visible");
    });

    it("should change task status quickly using status dropdown", () => {
      cy.visit("/project/1/task/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@taskDetailsRequest");

      // Mock the task update API response
      cy.intercept("PUT", "/api/projects/1/tasks/1", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Task 1",
          description: "First task",
          status: "COMPLETED",
          priority: "HIGH",
          dueDate: "2023-12-15",
          projectId: 1,
          milestoneId: 1,
        },
      }).as("updateTaskStatusRequest");

      // Change status using the quick status dropdown
      cy.get('select[id="quickStatusChange"]').select("COMPLETED");

      // Wait for the update request
      cy.wait("@updateTaskStatusRequest");

      // Verify the status has been updated
      cy.contains("COMPLETED").should("be.visible");
    });

    it("should delete a task", () => {
      cy.visit("/project/1/task/1");
      cy.wait("@authCheck");
      cy.wait("@projectDetailsRequest");
      cy.wait("@taskDetailsRequest");

      // Mock the task delete API response
      cy.intercept("DELETE", "/api/projects/1/tasks/1", {
        statusCode: 200,
      }).as("deleteTaskRequest");

      // Click delete button and confirm
      cy.contains("button", "Delete Task").click();
      cy.contains("button", "Confirm").click();

      // Wait for the delete request
      cy.wait("@deleteTaskRequest");

      // Should redirect to tasks list
      cy.url().should("include", "/project/1/task");
      cy.url().should("not.include", "/task/1");
    });
  });
});
