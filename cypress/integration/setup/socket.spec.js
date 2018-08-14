// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjVhMDE1YjBkMWUxYjVmMzRjMTIwMGEiLCJzY29wZSI6WyJzYW5kYm94Il0sImNoYXJMaW1pdCI6NTAwMDAsImlhdCI6MTUzNDIxNTY1MiwiZXhwIjoxNTM0MjE1NjcyLCJhdWQiOiIxMjcuMC4wLjEiLCJpc3MiOiJzb21lIHVuaXF1ZSBzZXJ2ZXIgaWRlbnRpZmllciB0byBiZSBjbG91ZC1yZWFkeSIsInN1YiI6Imthc2h5YXAtZGV2ZWxvcC0xIiwianRpIjoiZ2VuZXJhdGUgbmV3IGFuZCBzYXZlIHdpdGggZWRpdG9yL3RleHRhcmVhIGVudGl0eSJ9.cuvkjEeLrQdwVXAcqy4gb-immH5fFTgn3jPQBpQmMh0";

// describe("start ops socket after succesful auth", () => {
//   before(() => {
//     cy.window().then(win =>
//       win.localStorage.setItem(
//         "socketCluster.authToken",
//         "5b5a015b0d1e1b5f34c1200a"
//       )
//     );
//   });

//   it("should have socketCluster in window", () => {
//     cy.window().should("have.property", "io");
//   });

//   it("Initiate sc connection with auth token", () => {
//     cy.window().then(win => {
//       const socket = win.io("http://localhost:5000");
//       socket.on("connect", () => {
//         expect(true).to.eq(true);
//       });
//     });
//   });
// });
