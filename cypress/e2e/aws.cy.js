describe("AWS autofill delete", () => {
  it("run", () => {
    cy.viewport(1144, 693);
    const baseDomain = Cypress.env('baseDomain');
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    const region = Cypress.env('region')

    // LOGIN
    cy.visit(`https://${baseDomain}.signin.aws.amazon.com/console`);
    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.get("#signin_button").click();
    cy.location("href").should("eq", `https://${region}.console.aws.amazon.com/console/home?region=${region}#`);
    // Hide cookie popup
    cy.get("#awsccc-cb-buttons > button:nth-child(2) > span").click();

    // DYNAMODB
    // table
    cy.visit(`https://${region}.console.aws.amazon.com/dynamodbv2/home?region=${region}#tables`);
    cy.get('[data-testid=polaris-app-layout] main table > tbody > tr:first-child input[type=checkbox]').click(); // first table checkbox
    cy.get('[data-testid=polaris-app-layout] main [class*=awsui_header-controls] [class*=awsui_actions] > div > div:nth-child(3) > button').click(); // delete button
    cy.get('[data-testid=delete-table-modal] [class*=awsui_dialog] [class*=awsui_footer] button[data-testid=submit-form]').should('not.be.disabled');
    cy.get('[data-testid=delete-table-modal] [class*=awsui_dialog] [class*=awsui_footer] button[data-testid=cancel-form]').click();

    // backup
    cy.visit(`https://${region}.console.aws.amazon.com/dynamodbv2/home?region=${region}#list-backups`);
    cy.get('[data-testid=polaris-app-layout] main table > tbody > tr:first-child input[type=checkbox]').click(); // first backup checkbox
    cy.get('button[data-testid=list-backups-table__delete]').click(); // delete button
    cy.get('[data-testid=delete-backup-modal] button[data-testid=confirm-delete-button]').should('not.be.disabled');
    cy.get('[data-testid=delete-backup-modal] button[data-testid=cancel-delete-button]').click();

    // index
    cy.visit(`https://${region}.console.aws.amazon.com/dynamodbv2/home?region=${region}#table?initialTagKey=&name=autofill-delete-test-globaltable&tab=indexes`);
    cy.get('[data-testid=polaris-app-layout] main .detailsContainer table >tbody > tr:first-child input[type=radio]').click() // first index
    cy.get('[data-testid=polaris-app-layout] main .detailsContainer awsui-table [class*=awsui-table-header] [class*=awsui_actions] > div > div:first-child button[type=submit]').click() // delete button
    cy.get('.awsui-modal-footer button[data-testid=submit-form]').should('not.be.disabled');
    cy.get('.awsui-modal-footer button[data-testid=cancel-form]').click();

    // replica (global table)
    cy.visit(`https://${region}.console.aws.amazon.com/dynamodbv2/home?region=${region}#table?initialTagKey=&name=autofill-delete-test-globaltable&tab=globalTables`);
    cy.get('[data-testid=polaris-app-layout] main .detailsContainer table > tbody > tr:first-child input[type=radio]').click() // first replica
    cy.get('[data-testid=polaris-app-layout] main .detailsContainer [class*=awsui_header] [class*=awsui_actions] > div > div:nth-child(2) button[type=submit]').click() // delete button
    cy.get('[class*=awsui_dialog] [class*=awsui_footer] [class*=awsui_child]:last-child button[type=submit]').should('not.be.disabled');
    cy.get('[class*=awsui_dialog] [class*=awsui_header] [class*=awsui_actions] button[class*=awsui_dismiss-control]').click();

    // ensure creation modal input is not autofilled (create local index modal)
    cy.visit(`https://${region}.console.aws.amazon.com/dynamodbv2/home?region=${region}#create-table`);
    cy.get('div[role=radiogroup] [data-value=CUSTOMIZED] input[value=CUSTOMIZED][type=radio]').click();
    cy.get('button[data-testid=create-lsi]').click();
    cy.get('[data-testid=sort-key-input-field] > input[type=text]').should('be.empty');
    cy.get('[class*=awsui_dialog] [class*=awsui_footer] button[data-testid=cancel-form]').click();

  });
});