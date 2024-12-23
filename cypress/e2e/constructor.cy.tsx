describe('Burger Constructor Integration Tests', () => {
  const testUrl = 'http://localhost:4002';
  const bunId = '643d69a5c3f7b9001cfa0948';
  const meatId = '643d69a5c3f7b9001cfa093f';
  const apiUrl =
    Cypress.env('BURGER_API_URL') || 'https://norma.nomoreparties.space/api';

  const ingredientSelector = (id) => `[data-testid="ingredient-${id}"]`;
  const orderButtonSelector = '[data-testid="order-button"]';
  const modalCloseButtonSelector = '[data-testid="modal-close-button"]';
  const burgerConstructorSelector =
    '[data-testid="burger-constructor"].elements';

  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', `${apiUrl}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехват запроса на создание заказа
    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Флюоресцентный люминесцентный бургер',
        order: {
          _id: '6691143b119d45001b4f84fa',
          number: 11111
        }
      }
    }).as('createOrder');

    cy.intercept('GET', `${apiUrl}/auth/user`, {
      fixture: 'user.json'
    });

    // Посещение страницы конструктора бургера
    cy.visit(testUrl);
  });

  it('should add ingredients to the burger constructor', () => {
    // Добавляем булку и мясо
    cy.get(ingredientSelector(bunId)).click(); // Добавляем булку
    cy.get(ingredientSelector(meatId)).click(); // Добавляем мясо

    // Ждем, пока загрузятся ингредиенты
    cy.wait('@getIngredients');

    // Проверяем, что ингредиенты добавлены в конструктор
    cy.get(burgerConstructorSelector).should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(burgerConstructorSelector).should(
      'contain',
      'Филе Люминесцентного тетраодонтимформа'
    );
  });

  it('should open ingredient modal', () => {
    // Открываем модальное окно для булки
    cy.get(ingredientSelector(bunId)).click();

    // Проверяем, что модальное окно открыто
    cy.get('.modal').should('exist');
    cy.get('.modal').should('contain', 'Флюоресцентная булка R2-D3');

    // Закрываем модальное окно
    cy.get(modalCloseButtonSelector).click(); // Клик на крестик
    cy.get('.modal').should('not.exist');
  });

  it('should create an order and verify the order modal', () => {
    // Добавляем ингредиенты
    cy.get(ingredientSelector(bunId)).click(); // Добавляем булку
    cy.get(ingredientSelector(meatId)).click(); // Добавляем мясо

    // Оформляем заказ
    cy.get(orderButtonSelector).click(); // Клик на кнопку "Оформить заказ"

    cy.intercept('POST', '/api/orders').as('createOrder');

    // Ждем, пока создастся заказ
    cy.wait('@createOrder')
      .its('response.body')
      .then((response) => {
        expect(response.success).to.be.true;
        expect(response.order.number).to.equal(11111);
      });

    // Проверяем, что модальное окно открыто и номер заказа верный
    cy.get('.modal').should('exist');
    cy.get('.modal').should('contain', '11111'); // Проверяем номер заказа

    // Закрываем модальное окно
    cy.get(modalCloseButtonSelector).click(); // Клик на крестик
    cy.get('.modal').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get(burgerConstructorSelector).should('not.exist');
  });

  it('should create an order and verify the order data', () => {
    // Добавляем ингредиенты
    cy.get(ingredientSelector(bunId)).click(); // Добавляем булку
    cy.get(ingredientSelector(meatId)).click(); // Добавляем мясо

    // Перехватываем запрос на создание заказа
    cy.intercept('POST', '/api/orders').as('createOrder');

    // Оформляем заказ
    cy.get(orderButtonSelector).click(); // Клик на кнопку "Оформить заказ"

    // Ждем, пока создастся заказ
    cy.wait('@createOrder')
     .its('request.body')
     .then((requestBody) => {
        // Проверяем данные в теле запроса
        expect(requestBody.ingredients).to.deep.equal([bunId, meatId]);
      });

    // Проверяем, что модальное окно открыто и номер заказа верный
    cy.get('.modal').should('exist');
    cy.get('.modal').should('contain', '11111'); // Проверяем номер заказа

    // Закрываем модальное окно
    cy.get(modalCloseButtonSelector).click(); // Клик на крестик
    cy.get('.modal').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get(burgerConstructorSelector).should('not.exist');
  });
});
