export const addChartCommands = () => {
  Cypress.Commands.add(
    'matchImageSnapshotOnCI',
    { prevSubject: 'optional' },
    (subject, nameOrOptions?: string | Object) => {
      if (!Cypress.env('disableSnapshotTests')) {
        if (subject) {
          cy.wrap(subject).matchImageSnapshot(nameOrOptions);
        } else {
          cy.matchImageSnapshot(nameOrOptions);
        }
      }
    }
  );
};
