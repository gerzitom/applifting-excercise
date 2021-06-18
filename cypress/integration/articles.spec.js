context('Actions', () => {
  beforeEach(() => {
    cy.login()
  })

  // it('Some articles should be displayed', () => {
  //   cy.wait(4000).then(() => {
  //     const articles = cy.get('[data-test-id="articles-list"]')
  //     articles.children().should('have.length.at.least', 1)
  //   })
  // })

  it('Can view article details and add comment', async () => {
    cy.wait(4000).then(async () => {
      cy.get('[data-test-id="articles-list"]')
      const articles = cy.get('[data-test-id="articles-list"]')
      articles.children().should('have.length.at.least', 1)
      const article = cy.contains('Cypress test article')
      article.click()

      cy.wait(3000).then(() => {
        cy.get('[data-test-id="heading"]').should('not.be.empty')
        cy.get('[data-test-id="perex"]').should('not.be.empty')
        cy.get('[data-test-id="content"]').should('not.be.empty')

        const newHash = Math.random().toString(36).substring(7)
        const newCommentText = 'New comment ' + newHash
        cy.get('[data-test-id="comment_content"]').type(newCommentText)
        cy.get('[data-test-id="add_comment"]').click()

        cy.contains(newCommentText).should('not.be.empty')
      })
    })
  })
})
