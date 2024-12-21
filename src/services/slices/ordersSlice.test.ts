import { ordersReducer, initialState, getOrder, getOrders } from './ordersSlice';
import { TOrder, TOrdersData } from '@utils-types';

// Моковые данные для тестов
const mockOrder: TOrder = {
  _id: "6618f76897ede0001d0653db",
  status: "done",
  name: "Краторный био-марсианский бургер",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T01:00:00.000Z",
  number: 51530,
  ingredients: [
    "643d69a5c3f7b9001cfa093c", 
    "643d69a5c3f7b9001cfa0941"  
  ]
};

const mockOrders: TOrdersData = {
  success: true,
  orders: [mockOrder],
  total: 1,
  totalToday: 1
};

describe('ordersSlice', () => {

  it('should return the initial state', () => {
    expect(ordersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle getOrder.pending', () => {
    const action = getOrder.pending('', '');
    const newState = ordersReducer(initialState, action);
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('should handle getOrder.rejected', () => {
    const action = getOrder.rejected(new Error('Ошибка при получении заказа'), '', {});
    const newState = ordersReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка при получении заказа');
  });

  it('should handle getOrder.fulfilled', () => {
    const action = getOrder.fulfilled(mockOrder, '', {});
    const newState = ordersReducer(initialState, action);
    expect(newState.order).toEqual(mockOrder); // Проверяем, что заказ добавлен
    expect(newState.isLoading).toBe(false);
  });

  it('should handle getOrders.pending', () => {
    const action = getOrders.pending('', '');
    const newState = ordersReducer(initialState, action);
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('should handle getOrders.rejected', () => {
    const action = getOrders.rejected(new Error('Ошибка при получении всех заказов'), '', {});
    const newState = ordersReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка при получении всех заказов');
  });

  it('should handle getOrders.fulfilled', () => {
    const action = getOrders.fulfilled(mockOrders, '', {});
    const newState = ordersReducer(initialState, action);
    expect(newState.orders).toEqual(mockOrders.orders); // Проверяем, что все заказы добавлены
    expect(newState.total).toBe(mockOrders.total); // Проверяем общее количество заказов
    expect(newState.totalToday).toBe(mockOrders.totalToday); // Проверяем количество заказов на сегодня
    expect(newState.isLoading).toBe(false);
  });
});
