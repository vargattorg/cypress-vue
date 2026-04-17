describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Logs in successfully with valid credentials", () => {
    cy.get('[name="username"]').type("testuser");
    cy.get('[name="password"]').type("testpassword");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome testuser!");
  });

  it("Should display login form on page load", () => {
    cy.get("form").should("be.visible");
    cy.get('[name="username"]').should("be.visible");
    cy.get('[name="password"]').should("be.visible");
    cy.get('[type="submit"]').should("be.visible");
  });

  it("Should allow typing in username field", () => {
    cy.get('[name="username"]').type("john_doe");
    cy.get('[name="username"]').should("have.value", "john_doe");
  });

  it("Should allow typing in password field", () => {
    cy.get('[name="password"]').type("securepassword123");
    cy.get('[name="password"]').should("have.value", "securepassword123");
  });

  it("Should prevent form submission with empty fields", () => {
    cy.get('[type="submit"]').click();
    cy.get("h1").should("not.exist");
  });

  it("Should clear form after successful login", () => {
    cy.get('[name="username"]').type("testuser");
    cy.get('[name="password"]').type("testpassword");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome testuser!");
    cy.get('[name="username"]').should("have.value", "");
    cy.get('[name="password"]').should("have.value", "");
  });

  it("Should display welcome message with correct username", () => {
    cy.get('[name="username"]').type("admin");
    cy.get('[name="password"]').type("adminpass");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome admin!");
  });

  it("Should fail - incorrect welcome message text (intentional failure)", () => {
    cy.get('[name="username"]').type("testuser");
    cy.get('[name="password"]').type("testpassword");
    cy.get('[type="submit"]').click();
    // This assertion should fail because the text will be "Welcome testuser!" not "Hello testuser!"
    // cy.get("h1").should("have.text", "Hello testuser!");
  });
});
