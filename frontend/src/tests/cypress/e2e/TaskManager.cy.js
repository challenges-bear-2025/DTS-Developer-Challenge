/* eslint-disable no-undef */
describe("Task Manager Application", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "/tasks", { fixture: "tasks.json" }).as("getTasks");

    cy.intercept("POST", "/tasks", (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 3,
          ...req.body,
        },
      });
    }).as("createTask");

    cy.intercept("GET", "/tasks/*", (req) => {
      const taskId = req.url.split("/").pop();
      req.reply({
        statusCode: 200,
        body: {
          id: taskId,
          title: "Test Task",
          description: "Task description",
          status: "Pending",
          dueDate: "2025-05-01T17:00:00.000Z",
        },
      });
    }).as("fetchTask");

    cy.intercept("PUT", "/tasks/*", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...req.body,
          id: parseInt(req.url.split("/").pop()),
        },
      });
    }).as("updateTask");

    cy.intercept("DELETE", "/tasks/*", {
      statusCode: 204,
    }).as("deleteTask");

    cy.wait("@getTasks");
  });

  it("displays the task list correctly", () => {
    cy.get("header").contains("HMCTS Employee Portal").should("be.visible");
    cy.get(".govuk-breadcrumbs").contains("Task manager").should("be.visible");

    cy.contains("2 tasks found").should("be.visible");

    cy.contains("Test Task 1").should("be.visible");
    cy.contains("Test Task 2").should("be.visible");

    cy.contains("Pending").should("be.visible");
    cy.contains("Completed").should("be.visible");
  });

  it("filters tasks by status", () => {
    cy.get("select#filter").select("Completed");

    cy.contains("Test Task 1").should("not.exist");
    cy.contains("Test Task 2").should("be.visible");

    cy.get("select#filter").select("Pending");

    cy.contains("Test Task 1").should("be.visible");
    cy.contains("Test Task 2").should("not.exist");

    cy.get("select#filter").select("All");
    cy.contains("Test Task 1").should("be.visible");
    cy.contains("Test Task 2").should("be.visible");
  });

  it("expands a task to show details", () => {
    cy.contains("Test Task 1").click();

    cy.contains("Description").should("be.visible");
    cy.contains("Change Status").should("be.visible");
    cy.contains("Delete").should("be.visible");

    cy.contains("button", "Pending").should("be.visible");
    cy.contains("button", "In Progress").should("be.visible");
    cy.contains("button", "Completed").should("be.visible");

    cy.contains("Test Task 1").click();
    cy.contains("Description").should("not.exist");
  });

  it("changes task status", () => {
    cy.contains("Test Task 1").click();

    cy.contains("button", "In Progress").click();
    cy.wait("@updateTask");

    cy.contains(".govuk-tag", "In Progress").should("be.visible");

    cy.contains("button", "Completed").click();
    cy.wait('@fetchTask');
    cy.wait('@updateTask');

    cy.contains(".govuk-tag", "Completed").should("be.visible");
  });

  it("creates a new task", () => {
    cy.contains("button", "Create Task").click();

    cy.contains("h1", "Add New Task").should("be.visible");

    cy.get("#task-title").type("E2E Test Task");
    cy.get("#task-description").type(
      "This task was created during E2E testing"
    );
    cy.get("#task-due-day").type("15");
    cy.get("#task-due-month").type("12");
    cy.get("#task-due-year").type("2025");
    cy.get("#task-due-time").type("14:30");

    cy.contains("button", "Create Task").click();
    cy.wait("@createTask");

    cy.contains("E2E Test Task").should("be.visible");
  });

  it("validates the task form", () => {
    cy.contains("button", "Create Task").click();

    cy.contains("button", "Create Task").click();

    cy.contains("Title is required").should("be.visible");
    cy.contains("Enter your due date").should("be.visible");

    cy.get("#task-title").type("Invalid Task");
    cy.contains("button", "Create Task").click();

    cy.contains("Enter your due date").should("be.visible");
  });

  it("deletes a task", () => {
    cy.contains("Test Task 1").click();

    cy.contains("button", "Delete").click();

    cy.contains("button", "Yes, Delete").click();
    cy.wait("@deleteTask");

    cy.contains("Test Task 1").should("not.exist");
  });

  it("handles empty task list", () => {
    cy.intercept("GET", "/tasks", { body: [] }).as("getEmptyTasks");
    cy.visit("http://localhost:3000");
    cy.wait("@getEmptyTasks");

    cy.contains("Your task list is currently empty").should("be.visible");
    cy.contains("Click the button above to add your first task").should(
      "be.visible"
    );
  });

  it("handles API errors gracefully", () => {
    cy.intercept("GET", "/tasks", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("getTasksError");

    cy.visit("http://localhost:3000");
    cy.wait("@getTasksError");

    cy.contains("There was an error retrieving your task list").should(
      "be.visible"
    );
    cy.contains("Try Again").should("be.visible");
  });
});
