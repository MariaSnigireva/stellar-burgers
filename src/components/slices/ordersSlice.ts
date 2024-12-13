import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'createOrder',
  async (orderData: string[]) => {
    const response = await orderBurgerApi(orderData);
    return response;
  }
);

export const getOrders = createAsyncThunk('getOrders', async () => {
  const response = await getOrdersApi();
  return response;
});

export const getOrderByNumber = createAsyncThunk(
  'getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

interface OrderState {
  orders: TOrder[];
  order: TOrder | null;
  loading: boolean;
  error: string | null; // Добавление состояния для ошибки
}

export const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null, // Изначально нет ошибок
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    deleteOrder: (state) => {
      state.order = null;
      state.orders = [];
      state.loading = false;
      state.error = null; // Сбрасываем состояние ошибки при удалении заказа
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.loading = false;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        console.log('createOrder action payload',action.payload.order);
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(getOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Селекторы
export const selectOrder = (state: { order: OrderState }) => state.order.order;
export const selectOrderById = (id: number) => (state: { order: OrderState }) =>
  state.order.orders.find(order => order.number === id);
export const selectLoading = (state: { order: OrderState }) => state.order.loading;
export const selectOrders = (state: { order: OrderState }) => state.order.orders;
export const selectError = (state: { order: OrderState }) => state.order.error; // Новый селектор для ошибки

export const { deleteOrder } = orderSlice.actions;

export default orderSlice.reducer;
