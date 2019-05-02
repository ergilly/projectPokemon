describe('Test if user can have duplicate pokemon', function() {
  it('User already has this pokemon and cannot have another', function() {
    cy.visit('http://localhost:3001/');

    cy.get('#name-input').type('bulbasaur')
    cy.get('#save').click()

    cy.get('#name-input').type('bulbasaur')
    cy.get('#save').click()

    cy.get('.have-pokemon').eq(0).contains("You already have this Pokémon")
  })
})

describe('Test that if inventory is full pokemon is put into library', function() {
  it('Mew was put in the library', function() {

    cy.visit('http://localhost:3001/');

    cy.get('#name-input').type('mew')
    cy.get('#save').click()

    cy.get('.grid-item-150').click()

    cy.get('#info').contains('Mew');

  })
})
