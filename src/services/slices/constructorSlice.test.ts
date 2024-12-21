import { constructorReducer, initialState, addIngredient, deleteIngredient, moveUp, moveDown, clearBurgerConstructor } from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

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
  id: 'bun-1' // Добавляем поле id для соответствия типу
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
  id: 'main-1' // Добавляем поле id для соответствия типу
};

describe('constructorSlice', () => {
  it('should return the initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle addIngredient for bun', () => {
    const action = addIngredient(mockBun);
    const newState = constructorReducer(initialState, action);
    expect(newState.bun).toEqual(mockBun); // Проверяем, что булка добавлена
    expect(newState.ingredients).toHaveLength(0); // Проверяем, что других ингредиентов нет
  });

  it('should handle addIngredient for main ingredient', () => {
    const action = addIngredient(mockMainIngredient);
    const newState = constructorReducer(initialState, action);
    expect(newState.ingredients).toHaveLength(1); // Проверяем, что ингредиент добавлен
    expect(newState.ingredients[0]).toEqual(expect.objectContaining(mockMainIngredient)); // Проверяем, что добавленный ингредиент соответствует моковым данным
  });

  it('should handle deleteIngredient', () => {
    initialState.ingredients = [mockMainIngredient]; // Устанавливаем состояние с ингредиентом
    const deleteAction = deleteIngredient({ id: mockMainIngredient.id }); // Удаляем ингредиент по id
    const newState = constructorReducer(initialState, deleteAction);
    expect(newState.ingredients).toHaveLength(0); // Проверяем, что ингредиенты очищены
  });

  it('should handle moveUp', () => {
    initialState.ingredients = [mockMainIngredient, mockBun]; // Устанавливаем состояние с ингредиентами
    const moveAction = moveUp(1); // Перемещаем "Краторная булка" вверх
    const newState = constructorReducer(initialState, moveAction);
    expect(newState.ingredients[0]).toEqual(mockBun); // Проверяем порядок ингредиентов
    expect(newState.ingredients[1]).toEqual(mockMainIngredient);
  });

  it('should handle moveDown', () => {
    initialState.ingredients = [mockBun, mockMainIngredient]; // Устанавливаем состояние с ингредиентами
    const moveAction = moveDown(0); // Перемещаем "Краторная булка" вниз
    const newState = constructorReducer(initialState, moveAction);
    expect(newState.ingredients[0]).toEqual(mockMainIngredient); // Проверяем порядок ингредиентов
    expect(newState.ingredients[1]).toEqual(mockBun);
  });

  it('should handle clearBurgerConstructor', () => {
    initialState.bun = mockBun; // Устанавливаем булку
    initialState.ingredients = [mockMainIngredient]; // Устанавливаем ингредиенты
    const action = clearBurgerConstructor(); // Очищаем заказ
    const newState = constructorReducer(initialState, action);
    expect(newState.bun).toBeNull(); // Проверяем, что булка очищена
    expect(newState.ingredients).toHaveLength(0); // Проверяем, что ингредиенты очищены
  });
});
