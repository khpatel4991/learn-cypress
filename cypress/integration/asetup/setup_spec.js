// it("does not do much", () => {
//   // Arrange - Setup initial app state
//   // - visit a web page
//   // - query for an element
//   // Act - take an action
//   // - interact with that element
//   // Assert - make an assertion
//   // - Make assertions about changes in our app
// });

// requestOptions Object (Cypress Request command)
// required - method: string, e.g. GET, POST etc...
// required - url: string, Request Endpoint
// optional - failOnStatusBody: boolean, true to test 2xx or 3xx, `false` to test 4xx or 5xx failure cases use false.
// optional - body: any, payl

describe("Setup", () => {
  before(() => {
    cy.visit("http://localhost:8081")
      .get("textarea:first")
      .focus();
  });

  describe("handle auth & persist to localStorage", () => {
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

    it("sends token succesful auth token on first focus", () => {
      cy.editorLogin("5b5a015b0d1e1b5f34c1200a").then(response => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("token");
      });
    });

    it("persists authToken to localstorage", () => {
      cy.editorLogin("5b5a015b0d1e1b5f34c1200a").then(response => {
        cy.window().then(win => {
          win.localStorage.setItem(
            "socketCluster.authToken",
            response.body.token
          );
          console.info(win.localStorage.getItem("socketCluster.authToken"));
        });
      });
    });

    it("fails silently when origin dont match", () => {
      cy.editorLogin("5b5b9895dc67be725e242b33", false).then(response => {
        expect(response.status).to.eq(401);
      });
    });

    it("fails silently when no creds are given", () => {
      cy.editorLogin("", false).then(response => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe("start ops socket after succesful auth", () => {
    before(() => {
      cy.window().then(win =>
        win.localStorage.setItem(
          "socketCluster.authToken",
          "5b5a015b0d1e1b5f34c1200a"
        )
      );
    });

    it("should have socketCluster in window", () => {
      cy.window().should("have.property", "io");
    });

    it("Initiate sc connection with auth token", () => {
      cy.window().then(win => {
        const socket = win.io("http://localhost:5000");
        socket.on("connect", () => {
          expect(true).to.eq(true);
        });
      });
    });
  });
});
