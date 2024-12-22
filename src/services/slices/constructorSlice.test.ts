import { constructorReducer, initialState, addIngredient, deleteIngredient, moveUp, moveDown, clearBurgerConstructor } from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';

// Моковые данные для тестов
const mockBun: TConstructorIngredient = {
  _id: "643d69a5c3f7b9001cfa093c",
  name: "Краторная булка N-200i",
  type: "bun",
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: "https://code.s3.yandex.net/react/code/bun-02.png",
  image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
  image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
  id: 'bun-1'
};

const mockMainIngredient: TConstructorIngredient = {
  _id: "643d69a5c3f7b9001cfa0941",
  name: "Биокотлета из марсианской Магнолии",
  type: "main",
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: "https://code.s3.yandex.net/react/code/meat-01.png",
  image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
  image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
  id: 'main-1'
};

describe('constructorSlice', () => {
  it('should return the initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle addIngredient for bun', () => {
    const action = addIngredient(mockBun);
    const newState = constructorReducer(initialState, action);
    expect(newState.bun).toEqual(expect.objectContaining({
      _id: mockBun._id,
      name: mockBun.name,
      type: mockBun.type,
      proteins: mockBun.proteins,
      fat: mockBun.fat,
      carbohydrates: mockBun.carbohydrates,
      calories: mockBun.calories,
      price: mockBun.price,
      image: mockBun.image,
      image_mobile: mockBun.image_mobile,
      image_large: mockBun.image_large,
      // Не проверяем id, так как он может изменяться
    })); 
    expect(newState.ingredients).toHaveLength(0); // Проверяем, что других ингредиентов нет
  });

  it('should handle addIngredient for main ingredient', () => {
    const action = addIngredient(mockMainIngredient);
    const newState = constructorReducer(initialState, action);
    expect(newState.ingredients).toHaveLength(1); // Проверяем, что ингредиент добавлен
    expect(newState.ingredients[0]).toEqual(expect.objectContaining({
      _id: mockMainIngredient._id,
      name: mockMainIngredient.name,
      type: mockMainIngredient.type,
      proteins: mockMainIngredient.proteins,
      fat: mockMainIngredient.fat,
      carbohydrates: mockMainIngredient.carbohydrates,
      calories: mockMainIngredient.calories,
      price: mockMainIngredient.price,
      image: mockMainIngredient.image,
      image_mobile: mockMainIngredient.image_mobile,
      image_large: mockMainIngredient.image_large,
      // Не проверяем id, так как он может изменяться
    })); 
  });

  it('should handle deleteIngredient', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [mockMainIngredient],
    };
    const deleteAction = deleteIngredient({ id: mockMainIngredient.id }); // Удаляем ингредиент по id
    const newState = constructorReducer(stateWithIngredient, deleteAction);
    expect(newState.ingredients).toHaveLength(0); // Проверяем, что ингредиенты очищены
  });

  it('should handle moveUp', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockMainIngredient, mockBun],
    };
    const moveAction = moveUp(1); // Перемещаем "Краторная булка" вверх
    const newState = constructorReducer(stateWithIngredients, moveAction);
    expect(newState.ingredients[0]).toEqual(mockBun); // Проверяем порядок ингредиентов
    expect(newState.ingredients[1]).toEqual(mockMainIngredient);
  });

  it('should handle moveDown', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockBun, mockMainIngredient],
    };
    const moveAction = moveDown(0); // Перемещаем "Краторная булка" вниз
    const newState = constructorReducer(stateWithIngredients, moveAction);
    expect(newState.ingredients[0]).toEqual(mockMainIngredient); // Проверяем порядок ингредиентов
    expect(newState.ingredients[1]).toEqual(mockBun);
  });

  it('should handle clearBurgerConstructor', () => {
    const stateWithIngredients = {
      ...initialState,
      bun: mockBun,
      ingredients: [mockMainIngredient],
    };
    const action = clearBurgerConstructor(); // Очищаем заказ
    const newState = constructorReducer(stateWithIngredients, action);
    expect(newState.bun).toBeNull(); // Проверяем, что булка очищена
    expect(newState.ingredients).toHaveLength(0); // Проверяем, что ингредиенты очищены
  });
});
