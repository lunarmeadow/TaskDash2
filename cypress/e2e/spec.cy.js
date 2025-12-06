describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
});

it('login test', function() {
  cy.visit('localhost:4000')
  cy.get('#root a[href="/signin"] button.css-pvpsh5').click();
  cy.get('#\\:r6\\:').click();
  cy.get('#\\:r6\\:').type('admin@company.com');
  cy.get('#\\:r7\\:').click();
  cy.get('#\\:r7\\:').type('admin123');
  cy.get('#root button.css-11xs34k').click();
  cy.get('#root button.css-js41z').click();
  
});