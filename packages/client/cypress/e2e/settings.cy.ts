describe('Settings page', () => {
  beforeEach(() => {
    cy.visit('/settings');
  });

  it('groups GitLab URL/Private token separately from the other fields', () => {
    cy.contains('label', 'GitLab URL')
      .closest('div')
      .should('contain.text', 'Private token')
      .and('not.contain.text', 'User ID');

    cy.contains('label', 'User ID')
      .closest('div')
      .should('contain.text', 'Employee')
      .and('contain.text', 'Company');
  });

  it('saves settings and persists them after reload', () => {
    const gitlabUrl = 'https://gitlab.example.com/api/v4';

    cy.get('input[id]').first().clear().type(gitlabUrl);
    cy.contains('button', 'Save').click();

    cy.reload();
    cy.get('input[id]').first().should('have.value', gitlabUrl);
  });
});
