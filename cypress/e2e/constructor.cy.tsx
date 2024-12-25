describe('Burger Constructor Integration Tests', () => {
  const testUrl = 'http://localhost:4002';
  const bunId = '643d69a5c3f7b9001cfa093d';
  const meatId = '643d69a5c3f7b9001cfa093e';

  const ingredientSelector = (id) => `[data-testid="ingredient-${id}"]`;
  const orderButtonSelector = '[data-testid="order-button"]';
  const modalCloseButtonSelector = '[data-testid="modal-close-button"]';
  const burgerConstructorSelector = '[data-testid="burger-constructor"]';
  const modalSelector = '[data-cy="modal"]';

  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', `api/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    // Перехват запроса на создание заказа
    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.intercept('GET', `api/auth/user`, {
      fixture: 'user.json'
    });
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);

    // Посещение страницы конструктора бургера
    cy.visit(testUrl);
  });

  it('should add ingredients to the burger constructor', () => {
    // Добавляем булку и мясо
    cy.get(ingredientSelector(bunId)).contains('Добавить').click(); // Добавляем булку
    cy.get(ingredientSelector(meatId)).contains('Добавить').click(); // Добавляем мясо

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
    cy.get(modalSelector).should('be.visible');
    // Закрываем модальное окно
    cy.get(modalCloseButtonSelector).click(); // Клик на крестик
    cy.get(modalSelector).should('not.exist');
  });

  it('overlay', () => {
    //открытие
    cy.get(ingredientSelector(bunId)).click();
    cy.get(modalSelector).should('be.visible');

    // Закрытие по клику на оверлей
    cy.get('[data-testid="modal-overlay"]').click('topRight', { force: true });
    cy.get(modalSelector).should('not.exist');
  });

  it('should create an order and verify the order modal', () => {
    // Добавляем ингредиенты
    cy.get(ingredientSelector(bunId)).contains('Добавить').click(); // Добавляем булку
    cy.get(ingredientSelector(meatId)).contains('Добавить').click(); // Добавляем мясо

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
    cy.get(modalSelector).should('exist');
    cy.get(modalSelector).should('contain', '11111'); // Проверяем номер заказа

    // Закрываем модальное окно
    cy.get(modalCloseButtonSelector).click(); // Клик на крестик
    cy.get(modalSelector).should('not.exist');

    cy.get(burgerConstructorSelector).contains(bunId).should('not.exist');
    cy.get(burgerConstructorSelector).contains(meatId).should('not.exist');
  });
});
