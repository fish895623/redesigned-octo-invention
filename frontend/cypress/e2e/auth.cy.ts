/// <reference types="cypress" />
import { User } from "../support/interfaces";

describe("Authentication Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe("Login Page", () => {
    it("should display login form correctly", () => {
      cy.visit("/login");
      cy.contains("Welcome Back").should("be.visible");
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.contains("button", "Sign in").should("be.visible");
      cy.contains("a", "Create account").should("be.visible");
    });

    it("should show error message with invalid credentials", () => {
      cy.visit("/login");
      cy.get('input[type="email"]').type("invalid@example.com");
      cy.get('input[type="password"]').type("wrongpassword");
      cy.contains("button", "Sign in").click();

      // Wait for the error message to appear
      cy.contains("Invalid email or password", { timeout: 5000 }).should(
        "be.visible"
      );
    });

    it("should redirect to projects page on successful login", () => {
      // Define a mock user response
      const mockUser: User = {
        authenticated: true,
        id: 1,
        name: "Test User",
        email: "test@example.com",
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
      };

      // Intercept the login API call and mock a successful response
      cy.intercept("POST", "/api/auth/login", {
        statusCode: 200,
        body: mockUser,
      }).as("loginRequest");

      cy.visit("/login");
      cy.get('input[type="email"]').type(mockUser.email || "");
      cy.get('input[type="password"]').type("password123");
      cy.contains("button", "Sign in").click();

      // Wait for the login API call
      cy.wait("@loginRequest");

      // Should redirect to the projects page
      cy.url().should("include", "/project");
    });
  });

  describe("Registration Page", () => {
    it("should display registration form correctly", () => {
      cy.visit("/register");
      cy.contains("Create Account").should("be.visible");
      cy.get('input[id="name"]').should("be.visible");
      cy.get('input[id="email"]').should("be.visible");
      cy.get('input[id="password"]').should("be.visible");
      cy.get('input[id="confirmPassword"]').should("be.visible");
      cy.contains("button", "Create Account").should("be.visible");
      cy.contains("a", "Sign in").should("be.visible");
    });

    it("should show error when passwords do not match", () => {
      cy.visit("/register");
      cy.get('input[id="name"]').type("Test User");
      cy.get('input[id="email"]').type("newuser@example.com");
      cy.get('input[id="password"]').type("password123");
      cy.get('input[id="confirmPassword"]').type("differentPassword");
      cy.contains("button", "Create Account").click();

      // Should show password match error
      cy.contains("Passwords do not match").should("be.visible");
    });

    it("should register a new user successfully", () => {
      // Define a mock user response
      const mockUser: User = {
        authenticated: true,
        id: 2,
        name: "New User",
        email: "newuser@example.com",
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
      };

      // Intercept the register API call and mock a successful response
      cy.intercept("POST", "/api/auth/register", {
        statusCode: 200,
        body: mockUser,
      }).as("registerRequest");

      cy.visit("/register");
      cy.get('input[id="name"]').type(mockUser.name || "");
      cy.get('input[id="email"]').type(mockUser.email || "");
      cy.get('input[id="password"]').type("password123");
      cy.get('input[id="confirmPassword"]').type("password123");
      cy.contains("button", "Create Account").click();

      // Wait for the register API call
      cy.wait("@registerRequest");

      // Verify successful registration and redirection
      cy.contains("a", "Go to Projects").should("be.visible");
    });
  });
});
