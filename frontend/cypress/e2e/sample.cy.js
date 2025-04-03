describe("Sample Test", () => {
  it("should visit example.com", () => {
    cy.visit("https://example.com");
    cy.contains("Example Domain").should("exist");
  });
});
