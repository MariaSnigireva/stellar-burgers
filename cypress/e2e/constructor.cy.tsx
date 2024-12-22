describe('Burger Constructor Integration Tests', () => {
  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      statusCode: 200,
      body: [
        {
          "_id": "643d69a5c3f7b9001cfa0948",
          "name": "Флюоресцентная булка R2-D3",
          "type": "bun",
          "calories": 643,
          "carbohydrates": 85,
          "fat": 26,
          "image": "https://code.s3.yandex.net/react/code/bun-01.png",
          "price": 988,
          "proteins": 44
        },
        {
          "_id": "643d69a5c3f7b9001cfa093f",
          "name": "Филе Люминесцентного тетраодонтимформа",
          "type": "main",
          "calories": 643,
          "carbohydrates": 85,
          "fat": 26,
          "image": "https://code.s3.yandex.net/react/code/meat-03.png",
          "price": 988,
          "proteins": 44
        }
      ]
    }).as('getIngredients');

    // Перехват запроса на создание заказа
    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: {
        "success": true,
        "name": "Флюоресцентный люминесцентный бургер",
        "order": {
          "_id": "6691143b119d45001b4f84fa",
          "number": 11111
        }
      }
    }).as('createOrder');

    // Посещение страницы конструктора бургера
    cy.visit('http://localhost:4004'); 
  });
  it('should add ingredients to the burger constructor', () => {
    // Добавляем булку и мясо
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0948"]').click(); // Добавляем булку
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093f"]').click(); // Добавляем мясо
  
    // Ждем, пока загрузятся ингредиенты
    cy.wait('@getIngredients');
  
    // Проверяем, что ингредиенты добавлены в конструктор
    cy.get('[data-testid="burger-constructor"] .elements').should('contain', 'Флюоресцентная булка R2-D3');
    cy.get('[data-testid="burger-constructor"] .elements').should('contain', 'Филе Люминесцентного тетраодонтимформа');
  });

  it('should open ingredient modal', () => {
    // Открываем модальное окно для булки
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0948"]').click();
    
    // Проверяем, что модальное окно открыто
    cy.get('.modal').should('exist');
    cy.get('.modal').should('contain', 'Флюоресцентная булка R2-D3');
    
    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click(); // Клик на крестик
    cy.get('.modal').should('not.exist');
  });

  it('should create an order and verify the order modal', () => {
    // Добавляем ингредиенты
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0948"]').click(); // Добавляем булку
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093f"]').click(); // Добавляем мясо

    // Оформляем заказ
    cy.get('[data-testid="order-button"]').click(); // Клик на кнопку "Оформить заказ"

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
