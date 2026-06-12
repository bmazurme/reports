describe('Calendar page', () => {
  beforeEach(() => {
    cy.visit('/calendar');
  });

  it('shows the Calendar title and legend', () => {
    cy.contains('h2, [class*="header"]', 'Calendar');
    cy.contains('Короткий день');
    cy.contains('Праздник');
    cy.contains('Отпуск/отгул/больничный');
  });

  it('opens the "Add day off" dialog and enables Add once a range is picked', () => {
    cy.contains('button', 'Add day off').click();
    cy.get('[role="dialog"]').contains('Add day off');
    cy.get('[role="dialog"]').contains('button', 'Add').should('be.disabled');

    cy.get('[role="dialog"] input').first().click().type('12/31/2099-12/31/2099');
    cy.get('[role="dialog"]').contains('button', 'Add').should('not.be.disabled');

    cy.get('[role="dialog"]').contains('button', 'Cancel').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('opens a confirmation dialog when removing an existing off day', () => {
    cy.get('button[type="button"]')
      .filter((_, el) => /^\d{4}-\d{2}-\d{2}$/.test(el.textContent ?? ''))
      .first()
      .click();

    cy.get('[role="dialog"]').contains('Remove day off');
    cy.get('[role="dialog"]').contains('button', 'Cancel').click();
    cy.get('[role="dialog"]').should('not.exist');
  });
});
