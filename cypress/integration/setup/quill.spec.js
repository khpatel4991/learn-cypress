// it("does not do much", () => {
//   // Arrange - Setup initial app state
//   // - visit a web page
//   // - query for an element
//   // Act - take an action
//   // - interact with that element
//   // Assert - make an assertion
//   // - Make assertions about changes in our app
// });

describe("Set up quill after successful auth", () => {
  before(() => {
    cy.visit("http://localhost:8081")
      .get("textarea[data-pt-client-id]")
      .focus()
      .should("have.class", "perfecttense");
  });

  it("creates element on first focus", () => {
    cy.get("div.pte");
  });
});
