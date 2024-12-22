import { configureStore } from '@reduxjs/toolkit';
import { userOrderSlice } from './mainSlice';
import { TOrder } from '@utils-types';

// Определите здесь тип вашего состояния
type TUserOrdersState = {
  order: TOrder | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
};

const order: TOrder = {
  _id: '643d69a5c3f7b9001cfa093c',
  status: 'done',
  name: 'Краторная булка N-200i',
  createdAt: '2023-03-15T14:30:00.000Z',
  updatedAt: '2023-03-15T14:30:00.000Z',
  number: 12345,
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
};

describe('userOrderSlice', () => {
  const store = configureStore({
    reducer: {
      userOrder: userOrderSlice.reducer,
    },
  });

  it('should return the initial state', () => {
    const state = store.getState().userOrder;
    expect(state).toEqual(userOrderSlice.getInitialState());
  });

  it('should return the order selector', () => {
    const state = store.getState(); 
    const orderSelector = userOrderSlice.selectors.orderSelector(state); 
    expect(orderSelector).toBeNull();
  });

  it('should return the orders selector', () => {
    const state = store.getState(); 
    const ordersSelector = userOrderSlice.selectors.ordersSelector(state); 
    expect(ordersSelector).toEqual([]);
  });

  it('should return the order request selector', () => {
    const state = store.getState(); 
    const orderRequestSelector = userOrderSlice.selectors.orderRequest(state); 
    expect(orderRequestSelector).toBe(false);
  });

  it('should update the state when sendUserOrder is pending', () => {
    const action = {
      type: 'order/sendUserOrder/pending',
    };
    store.dispatch(action);
    const state = store.getState().userOrder;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull(); // Исправлено на null
    expect(state.orderRequest).toBe(true);
  });

  it('should update the state when sendUserOrder is rejected', () => {
    const action = {
      type: 'order/sendUserOrder/rejected',
      error: { message: 'Ошибка' }, // Ошибка должна быть объектом с полем message
    };
    store.dispatch(action);
    const state = store.getState().userOrder;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
    expect(state.orderRequest).toBe(false);
  });

  it('should update the state when sendUserOrder is fulfilled', () => {
    const action = {
      type: 'order/sendUserOrder/fulfilled',
      payload: { order },
    };
    store.dispatch(action);
    const state = store.getState().userOrder;
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(order);
    expect(state.orderRequest).toBe(false);
  });

  it('should update the state when getUserOrders is pending', () => {
    const action = {
      type: 'order/getUserOrders/pending',
    };
    store.dispatch(action);
    const state = store.getState().userOrder;
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  it('should update the state when getUserOrders is rejected', () => {
    const action = {
      type: 'order/getUserOrders/rejected',
      error: { message: 'Ошибка' }, // Ошибка должна быть объектом с полем message
    };
    store.dispatch(action);
    const state = store.getState().userOrder;
    expect(state.error).toBe('Ошибка');
    expect(state.isLoading).toBe(false);
  });

  it('should update the state when getUserOrders is fulfilled', () => {
    const action = {
      type: 'order/getUserOrders/fulfilled',
      payload: [order],
    };
    store.dispatch(action);
    const state = store.getState().userOrder;
    expect(state.orders).toEqual([order]);
    expect(state.isLoading).toBe(false);
  });

  it('should clear the order when clearOrder is dispatched', () => {
    store.dispatch(userOrderSlice.actions.clearOrder());
    const state = store.getState().userOrder;
    expect(state.order).toBeNull();
  });
});
