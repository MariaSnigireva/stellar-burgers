import { configureStore } from '@reduxjs/toolkit';
import { ordersSlice } from './ordersSlice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  }
];

describe('ordersSlice', () => {
  const store = configureStore({
    reducer: {
      orders: ordersSlice.reducer
    }
  });

  it('should return the initial state', () => {
    const state = store.getState();
    expect(state.orders).toEqual(ordersSlice.getInitialState());
  });

  it('should return the order slice', () => {
    const state = store.getState(); // Получаем полное состояние
    const orderSlice = ordersSlice.selectors.getOrderSlice(state); // Передаем полное состояние
    expect(orderSlice).toEqual(null); // Начальное значение null
  });

  it('should return the orders slice', () => {
    const state = store.getState(); // Получаем полное состояние
    const ordersSliceResult = ordersSlice.selectors.getOrdersUser(state); // Передаем полное состояние
    expect(ordersSliceResult).toEqual([]);
  });

  it('should return the total slice', () => {
    const state = store.getState(); // Получаем полное состояние
    const totalSlice = ordersSlice.selectors.getTotalSlice(state); // Передаем полное состояние
    expect(totalSlice).toBe(0);
  });

  it('should return the total today slice', () => {
    const state = store.getState(); // Получаем полное состояние
    const totalTodaySlice = ordersSlice.selectors.getTotalTodaySlice(state); // Передаем полное состояние
    expect(totalTodaySlice).toBe(0);
  });

  it('should update the state when getOrders is fulfilled', () => {
    const action = {
      type: 'order/getOrders/fulfilled',
      payload: {
        orders: ingredients,
        total: 10,
        totalToday: 5
      }
    };
    store.dispatch(action);
    const state = store.getState().orders;
    expect(state.orders).toEqual(ingredients);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
  });

  it('should update the state when getOrder is fulfilled', () => {
    const action = {
      type: 'order/getOrder/fulfilled',
      payload: {
        success: true,
        orders: [ingredients[0]] // Передаем массив заказов
      }
    };
    store.dispatch(action);
    const state = store.getState().orders;
    expect(state.order).toEqual(ingredients[0]); // Проверяем, что состояние обновилось
  });
});
