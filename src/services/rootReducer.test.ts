import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './store'; 
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userOrderReducer } from './slices/mainSlice';
import { userReducer } from './slices/authSlice';
import { ordersReducer } from './slices/ordersSlice';

// Моковые данные для тестов
const mockIngredient1 = {
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
  __v: 0
};

const mockIngredient2 = {
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
  __v: 0
};

const mockIngredient3 = {
  _id: "643d69a5c3f7b9001cfa093e",
  name: "Филе Люминесцентного тетраодонтимформа",
  type: "main",
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: "https://code.s3.yandex.net/react/code/meat-03.png",
  image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
  image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
  __v: 0
};

describe('Redux Store', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    });
  });

  it('should have initial state', () => {
    const state = store.getState();
    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, { type: '' }),
      burgerConstructor: constructorReducer(undefined, { type: '' }),
      userOrder: userOrderReducer(undefined, { type: '' }),
      user: userReducer(undefined, { type: '' }),
      orders: ordersReducer(undefined, { type: '' }),
    });
  });

  it('should dispatch actions and update ingredients state', () => {
    store.dispatch({ type: 'ingredients/addIngredient', payload: mockIngredient1 });

    const state = store.getState();
    expect(state.ingredients.ingredients).toContainEqual(mockIngredient1);

    store.dispatch({ type: 'ingredients/addIngredient', payload: mockIngredient2 });
    expect(state.ingredients.ingredients).toContainEqual(mockIngredient2);

    store.dispatch({ type: 'ingredients/addIngredient', payload: mockIngredient3 });
    expect(state.ingredients.ingredients).toContainEqual(mockIngredient3);
  });

  it('should handle multiple actions', () => {
    const sampleOrder = {
      _id: '643d69a5c3f7b9001cfa093c',
      status: 'done',
      name: 'Бургер 1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      number: 1,
      ingredients: [],
    };

    store.dispatch({ type: 'userOrder/sendUserOrder/fulfilled', payload: { order: sampleOrder } });

    const state = store.getState();
    expect(state.userOrder.order).toEqual(sampleOrder);
  });
});
