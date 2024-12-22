import { ingredientsReducer, initialState, getIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockIngredients: TIngredient[] = [
  {
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
    
  },
  {
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
    
  }
];

describe('ingredientsSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState; // Сбрасываем состояние перед каждым тестом
  });

  it('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle getIngredients.pending', () => {
    const action = getIngredients.pending('');
    const newState = ingredientsReducer(initialState, action);
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeUndefined();
  });

  it('should handle getIngredients.rejected', () => {
    const action = getIngredients.rejected(new Error('Ошибка при получении ингредиентов'), '');
    const newState = ingredientsReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка при получении ингредиентов');
  });

  it('should handle getIngredients.fulfilled', () => {
    const action = getIngredients.fulfilled(mockIngredients, '');
    const newState = ingredientsReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients); // Проверяем, что ингредиенты добавлены
  });
});
