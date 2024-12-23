describe('Burger Constructor Integration Tests', () => {
  const testUrl = 'http://localhost:4002';
  const bunId = '643d69a5c3f7b9001cfa0948';
  const meatId = '643d69a5c3f7b9001cfa093f';
  const apiUrl = Cypress.env('BURGER_API_URL') || 'https://norma.nomoreparties.space/api';

  const ingredientSelector = (id) => `[data-testid="ingredient-${id}"]`;
  const orderButtonSelector = '[data-testid="order-button"]';
  const modalCloseButtonSelector = '[data-testid="modal-close-button"]';
  const burgerConstructorSelector = '[data-testid="burger-constructor"] .elements';
  const modalSelector = '.modal'; // Новый селектор для модального окна

  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', `${apiUrl}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехват запроса на создание заказа
    cy.intercept('POST', `${apiUrl}/orders`, (req) => {
      expect(req.body).to.have.property('ingredients').and.to.be.an('array').that.includes(bunId, meatId);
    }).as('createOrder');

    // Перехват запроса на получение информации о пользователе
    cy.intercept('GET', `${apiUrl}/auth/user`, {
      fixture: 'user.json'
    });

    // Посещение страницы конструктора бургера
    cy.visit(testUrl);
  });

  it('should add ingredients to the burger constructor', () => {
    // Ждем, пока загрузятся ингредиенты
    cy.wait('@getIngredients');

    // Добавляем булку и мясо
    cy.get(ingredientSelector(bunId)).click(); // Добавляем булку
    cy.get(ingredientSelector(meatId)).click(); // Добавляем мясо

    // Проверяем, что ингредиенты добавлены в конструктор
    cy.get(burgerConstructorSelector).should('contain', 'Флюоресцентная булка R2-D3');
    cy.get(burgerConstructorSelector).should('contain', 'Филе Люминесцентного тетраодонтимформа');
  });

  it('should open ingredient modal', () => {
    // Открываем модальное окно для булки
    cy.get(ingredientSelector(bunId)).click();

    // Проверяем, что модальное окно открыто
    cy.get(modalSelector).should('exist');
    cy.get(modalSelector).should('contain', 'Флюоресцентная булка R2-D3');

    // Закрываем модальное окно
    cy.get(modalCloseButtonSelector).click();
    cy.get(modalSelector).should('not.exist');
  });

  it('should create an order and verify the order modal', () => {
    // Добавляем ингредиенты
    cy.get(ingredientSelector(bunId)).click(); // Добавляем булку
    cy.get(ingredientSelector(meatId)).click(); // Добавляем мясо

    // Оформляем заказ
    cy.get(orderButtonSelector).click(); // Клик на кнопку "Оформить заказ"

    // Ждем, пока создастся заказ и проверяем его данные
    cy.wait('@createOrder')
      .its('response.body')
      .then((response) => {
        expect(response.success).to.be.true;
        expect(response.order.number).to.equal(11111);
      });

    // Проверяем, что модальное окно открыто и номер заказа верный
    cy.get(modalSelector).should('exist');
    cy.get(modalSelector).should('contain', '11111'); // Проверяем номер заказа

    // Закрываем модальное окно
    cy.get(modalCloseButtonSelector).click();
    cy.get(modalSelector).should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get(burgerConstructorSelector).should('not.exist');
  });
});
//Почему не работает порт 4000, очень медленно грузит
