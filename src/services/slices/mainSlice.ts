import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TUserOrdersState = {
  order: TOrder | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null | unknown;
  orderRequest: boolean;
};

export const initialState: TUserOrdersState = {
  order: null,
  orders: [],
  isLoading: false,
  error: null,
  orderRequest: false
};

export const sendUserOrder = createAsyncThunk(
  'order/sendUserOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const getUserOrders = createAsyncThunk('order/getUserOrders', async () =>
  getOrdersApi()
);

export const userOrderSlice = createSlice({
  name: 'userOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  selectors: {
    orderSelector: (state) => state.order, // Селектор для получения текущего заказа
    ordersSelector: (state) => state.orders, // Селектор для получения всех заказов
    orderRequest: (state) => state.orderRequest // Селектор для получения флага запроса на заказ
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendUserOrder.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
        state.orderRequest = true;
      })
      .addCase(sendUserOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
        state.orderRequest = false;
      })
      .addCase(sendUserOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = action.error?.message;
        state.isLoading = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      });
  }
});

export const { clearOrder } = userOrderSlice.actions;
export const userOrderReducer = userOrderSlice.reducer;
export const {
  orderSelector,
  ordersSelector,
  orderRequest
} = userOrderSlice.selectors;
