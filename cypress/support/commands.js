// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add(
  'login',
  (
    userId = Cypress.env('userId'),
    username = Cypress.env('username'),
    password = Cypress.env('password')
  ) => {
    cy.visit('/login')
    cy.get('[data-test-id="user-id"]').type(userId)
    cy.get('[data-test-id="username"]').type(username)
    cy.get('[data-test-id="password"]').type(password)
    cy.get('[data-test-id="login_button"]').click()
  }
)

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
