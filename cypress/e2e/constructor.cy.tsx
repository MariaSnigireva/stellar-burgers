describe('Бургер конструктор', () => {
  before(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('http://localhost:4003'); 
  });

  afterEach(() => {
    cy.clearCookies(); // Очищаем куки после каждого теста
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку и начинку', () => {
      cy.wait('@getIngredients');

      // Добавление булки
      cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
      // Добавление начинки
      cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();

      // Проверка добавленных ингредиентов
      cy.get('[data-cy=constructor-bun-1]').contains('Ингредиент 1').should('exist');
      cy.get('[data-cy=constructor-bun-2]').contains('Ингредиент 1').should('exist');
      cy.get('[data-cy=constructor-ingredients]').contains('Ингредиент 2').should('exist');
    });
  });

  describe('Работа модального окна', () => {
    it('открытие модального окна', () => {
      cy.get('[data-cy=constructor-ingredients]').contains('Ингредиент 1').click();
      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').contains('Ингредиент 1').should('exist');
    });

    it('закрытие на крестик', () => {
      cy.get('[data-cy=constructor-ingredients]').contains('Ингредиент 1').click();
      cy.get('#modals button[aria-label="Закрыть"]').click();
      cy.get('#modals').should('be.empty');
    });

    it('закрытие на оверлей', () => {
      cy.get('[data-cy=constructor-ingredients]').contains('Ингредиент 1').click();
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('#modals').should('be.empty');
    });
  });

  describe('Собирается бургер', () => {
    before(() => {
      cy.intercept('GET', 'api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');
      const mockToken = 'mockToken12345';
      localStorage.setItem('accessToken', mockToken);
    });

    it('создание и оформление заказа', () => {
      cy.wait('@getUser');

      // Добавление булки и начинок
      cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
      cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
      cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();

      // Перехват запроса на создание заказа
      cy.intercept('POST', 'api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      // Оформление заказа
      cy.get('[data-cy=order-button]').click();
      cy.wait('@createOrder');

      // Проверка модального окна с номером заказа
      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').contains('123456').should('exist');

      // Закрытие модального окна
      cy.get('#modals button[aria-label="Закрыть"]').click();
      cy.get('#modals').should('be.empty');

      // Проверка, что конструктор пуст
      cy.get('[data-cy=constructor-bun-1]').should('not.exist');
      cy.get('[data-cy=constructor-ingredients]').should('not.exist');
    });
  });
});
