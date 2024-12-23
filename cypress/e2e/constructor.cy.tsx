describe('Burger Constructor Integration Tests', () => {
  const testUrl = 'http://localhost:4004';
  const bunId = '643d69a5c3f7b9001cfa0948';
  const meatId = '643d69a5c3f7b9001cfa093f';
  const url = 'https://norma.nomoreparties.space/api';

  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', `${url}/ingredients`, { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

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

    cy.intercept('GET', '${url}/auth/user', {
      fixture: 'user.json'
    });

    // Посещение страницы конструктора бургера
    cy.visit(testUrl);
  });

  it('should add ingredients to the burger constructor', () => {
    // Добавляем булку и мясо
    cy.get(`[data-testid="ingredient-${bunId}"]`).click(); // Добавляем булку
    cy.get(`[data-testid="ingredient-${meatId}"]`).click(); // Добавляем мясо

    // Ждем, пока загрузятся ингредиенты
    cy.wait('@getIngredients');

    // Проверяем, что ингредиенты добавлены в конструктор
    cy.get('[data-testid="burger-constructor"] .elements').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-testid="burger-constructor"] .elements').should(
      'contain',
      'Филе Люминесцентного тетраодонтимформа'
    );
  });

  it('should open ingredient modal', () => {
    // Открываем модальное окно для булки
    cy.get(`[data-testid="ingredient-${bunId}"]`).click();

    // Проверяем, что модальное окно открыто
    cy.get('.modal').should('exist');
    cy.get('.modal').should('contain', 'Флюоресцентная булка R2-D3');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click(); // Клик на крестик
    cy.get('.modal').should('not.exist');
  });

  it('should create an order and verify the order modal', () => {
    // Добавляем ингредиенты
    cy.get(`[data-testid="ingredient-${bunId}"]`).click(); // Добавляем булку
    cy.get(`[data-testid="ingredient-${meatId}"]`).click(); // Добавляем мясо

    // Оформляем заказ
    cy.get('[data-testid="order-button"]').click(); // Клик на кнопку "Оформить заказ"

    // Ждем, пока создастся заказ
    cy.wait('@createOrder');

    // Проверяем, что модальное окно открыто и номер заказа верный
    cy.get('.modal').should('exist');
    cy.get('.modal').should('contain', '11111'); // Проверяем номер заказа

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click(); // Клик на крестик
    cy.get('.modal').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get('[data-testid="burger-constructor"] .elements').should('not.exist');
  });
});
