describe('конструктор бургера', () => {
  const testUrl = 'http://localhost:4004';
  const modalBurger = '[data-cy="modal"]';

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    }).as('postOrder');

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Прелоадер', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.get('main').should('contain', 'Соберите бургер');
    cy.get('h1').should('contain', 'Соберите бургер');
  });

  it('Добавление ингредиентов', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    // добавление булок
    cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-bun-1"]').should('exist');
    cy.get('[data-cy="constructor-bun-2"]').should('exist');

    // добавление других ингредиентов
    cy.get('[data-ing="ingredient-item-main"]')
      .contains('Добавить')
      .click({ force: true });
    cy.get('[data-cy="constructor-topping"]').should('exist');

    cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-topping"]').should('exist');
  });

  it('Открытие и закрытие модального', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');

    //открытие
    cy.get('[data-cy="ingredient-item-1"]').click();
    cy.get(modalBurger).should('be.visible');

    // закрытие по клику на крестик
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get(modalBurger).should('not.exist');
  });

  it('Открытие и закрытие модального по клику на оверлей', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');

    //открытие
    cy.get('[data-cy="ingredient-item-2"]').click();
    cy.get(modalBurger).should('be.visible');

    // закрытие по оверлей
    cy.get('[data-cy="modal-overlay"]').click('topRight', { force: true });
    cy.get(modalBurger).should('not.exist');
  });

  it('Создание заказа', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();
    cy.get('[data-ing="ingredient-item-main"]').contains('Добавить').click();
    cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();

    //вызывается клик 
    cy.get('[data-cy=order-summ] button').click();

    //проверка открытия
    cy.get(modalBurger).contains('11111').should('exist');

    //закрывается модальное окно 
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get(modalBurger).should('not.exist');

    // конструктор пуст.
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 3')
      .should('not.exist');
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 4')
      .should('not.exist');
  });
});
//все сломалось...не понимаю
