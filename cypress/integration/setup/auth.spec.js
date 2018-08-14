// it("does not do much", () => {
//   // Arrange - Setup initial app state
//   // - visit a web page
//   // - query for an element
//   // Act - take an action
//   // - interact with that element
//   // Assert - make an assertion
//   // - Make assertions about changes in our app
// });

import jwt from "jsonwebtoken";

describe("Setup", () => {
  before(() => {
    cy.visit("http://localhost:8081")
      .get("textarea:first")
      .focus();
  });

  describe("Auth on first focus", () => {
    Cypress.Commands.add("editorLogin", (clientId, failOnStatusCode = true) => {
      const requestOptions = {
        body: {
          clientId
        },
        failOnStatusCode,
        method: "POST",
        url: "http://localhost:8081/auth"
      };
      return cy.request(requestOptions);
    });

    it("get auth token on first focus", () => {
      cy.editorLogin("5b5a015b0d1e1b5f34c1200a").then(response => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("authToken");
        const { authToken } = response.body;
        const { _id, sub, aud, charLimit, scope } = jwt.decode(authToken);
        expect(_id).to.eq("5b5a015b0d1e1b5f34c1200a");
        expect(sub).to.eq("kashyap-develop-1");
        expect(aud).to.eq("127.0.0.1");
        expect(charLimit).to.eq(50000);
        expect(scope.indexOf("sandbox") > -1).to.eq(true);
      });
    });

    it("fails silently when origin dont match", () => {
      cy.editorLogin("5b5b9895dc67be725e242b33", false).then(response => {
        expect(response.status).to.eq(401);
      });
    });

    it("fails silently when for invalid creds", () => {
      cy.editorLogin(132, false).then(response => {
        expect(response.status).to.eq(401);
      });
      cy.editorLogin("", false).then(response => {
        expect(response.status).to.eq(401);
      });
      cy.editorLogin("some rubbish", false).then(response => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
