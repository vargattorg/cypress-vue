describe("Input Validation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should handle special characters in username", () => {
    cy.get('[name="username"]').type("user@email.com");
    cy.get('[name="username"]').should("have.value", "user@email.com");
  });

  it("Should handle spaces in username", () => {
    cy.get('[name="username"]').type("john doe");
    cy.get('[name="username"]').should("have.value", "john doe");
  });

  it("Should handle long password input", () => {
    const longPassword = "verylongpasswordwith123456789andspecialchars!@#$%";
    cy.get('[name="password"]').type(longPassword);
    cy.get('[name="password"]').should("have.value", longPassword);
  });

  it("Should maintain focus on input fields", () => {
    cy.get('[name="username"]').click().should("have.focus");
    cy.get('[name="password"]').click().should("have.focus");
  });

  it("Should allow rapid successive clicks on submit button", () => {
    cy.get('[name="username"]').type("rapidtest");
    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome rapidtest!");
  });

  it("Should handle numeric-only username", () => {
    cy.get('[name="username"]').type("12345");
    cy.get('[name="password"]').type("password123");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome 12345!");
  });

  it("Should fail - test form elements count (intentional failure)", () => {
    // This will fail if the form doesn't have exactly 2 input fields + 1 submit button
    // cy.get("form").find("input").should("have.length", 5);
  });
});
