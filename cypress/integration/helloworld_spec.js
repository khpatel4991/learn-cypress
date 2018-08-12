// it("does not do much", () => {
//   // Arrange - Setup initial app state
//   // - visit a web page
//   // - query for an element
//   // Act - take an action
//   // - interact with that element
//   // Assert - make an assertion
//   // - Make assertions about changes in our app
// });

describe("Handle Auth on Textarea focus", () => {
  before(() => {
    cy.visit("http://localhost:8081")
      .get("textarea:first")
      .focus();
  });

  it("creates quill container after focus", () => {
    cy.window()
      .then(win => {
        console.info(win);
      })
      .should("have.property", "socketCluster");
  });

  it("sends token auth request on focus", () => {
    cy.request("POST", "http://localhost:8081/auth", {
      clientId: "5b5a015b0d1e1b5f34c1200a",
    }).then(response => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("token");
    });
  });

  it("fails silently when origin dont match", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/auth",
      failOnStatusCode: false,
      body: { clientId: "5b5b9895dc67be725e242b33" },
    }).then(response => {
      expect(response.status).to.eq(401);
    });
  });

  it("fails silently when no creds are given", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/auth",
      failOnStatusCode: false,
      body: {},
    }).then(response => {
      expect(response.status).to.eq(401);
    });
  });

  it("fails silently when post body is empty", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/auth",
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(400);
    });
  });
});
