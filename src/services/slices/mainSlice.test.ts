import { userOrderReducer, initialState, sendUserOrder, getUserOrders, clearOrder } from './mainSlice';
import { TOrder, TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockIngredient: TIngredient = {
  _id: "643d69a5c3f7b9001cfa093c",
  name: "Краторная булка N-200i",
  type: "bun",
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: "https://code.s3.yandex.net/react/code/bun-02.png",
  image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
  image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png"
};

const mockOrder: TOrder = {
  _id: "6618f76897ede0001d0653db",
  status: "done",
  name: "Краторный био-марсианский бургер",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T01:00:00.000Z",
  number: 51530,
  ingredients: [mockIngredient._id] // Используем ID ингредиента
};

// Моковые данные для всех заказов
const mockOrders = [mockOrder]; 

describe('userOrderSlice', () => {
  
  it('should return the initial state', () => {
    expect(userOrderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle sendUserOrder.pending', () => {
    const action = sendUserOrder.pending('', '');
    const newState = userOrderReducer(initialState, action);
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeUndefined();
    expect(newState.orderRequest).toBe(true);
  });

  it('should handle sendUserOrder.rejected', () => {
    const action = sendUserOrder.rejected(new Error('Ошибка при отправке заказа'), '', {});
    const newState = userOrderReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка при отправке заказа');
    expect(newState.orderRequest).toBe(false);
  });

  it('should handle sendUserOrder.fulfilled', () => {
    const action = sendUserOrder.fulfilled(mockOrder, '', {});
    const newState = userOrderReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.order).toEqual(mockOrder); // Проверяем, что заказ добавлен
    expect(newState.orderRequest).toBe(false);
  });

  it('should handle getUserOrders.pending', () => {
    const action = getUserOrders.pending('', '');
    const newState = userOrderReducer(initialState, action);
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('should handle getUserOrders.rejected', () => {
    const action = getUserOrders.rejected(new Error('Ошибка при получении заказов'), '', {});
    const newState = userOrderReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка при получении заказов');
  });

  it('should handle getUserOrders.fulfilled', () => {
    const action = getUserOrders.fulfilled(mockOrders, '', {});
    const newState = userOrderReducer(initialState, action);
    expect(newState.orders).toEqual(mockOrders); // Проверяем, что все заказы добавлены
    expect(newState.isLoading).toBe(false);
  });

  it('should handle clearOrder', () => {
    initialState.order = mockOrder; // Устанавливаем текущий заказ
    const action = clearOrder();
    const newState = userOrderReducer(initialState, action);
    expect(newState.order).toBeNull(); // Проверяем, что текущий заказ очищен
  });
});
