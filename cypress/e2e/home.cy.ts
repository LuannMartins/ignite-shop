describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000') // beforeEach executa por padrão url que vai utilizada por todos elementos abaixo.
  })
  
  context("Hero section", () => {
    it('Gets, types and asserts', () => {
      // o get vai fazer busca do elemento especifico do projeto em uso
      cy.get('[style="min-width: 295.667px; max-width: 295.667px; transform: translate3d(0px, 0px, 0px);"]')
        // .should('exist') // exist verifica se determinado elemento exist
        // .contains('') // em contains vamos ter que coloca o conteúdo do elemento para validação
    })

    it("the features on the homepage are correct", () => { // o only faz validação dos elementos dentro de uma função ou seja não aceita que outra função seja ativa exemplo a de cima
      cy.get('img').eq(0) //.contains('') // com "eq" eu posso pegar um elemento pelo index uma imagem especifica dentro de um array e fazer o teste
      cy.get('img').eq(1) //.contains('')
      cy.get('img').eq(2) //.contains('')
    })
  })

  // context("imagens", () => {
  //   it.only("the features on the homepage are correct", () => { // o only faz validação dos elementos dentro de uma função ou seja não aceita que outra função seja ativa exemplo a de cima
  //     cy.getByData('img').find('a').eq(3).click() //.contains('') // com "eq" eu posso pegar um elemento pelo index uma imagem especifica dentro de um array e fazer o teste
  //     cy.location('pathname').should('eq', '/teste')
  //   })
  // })
})
