import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersState = {
  order: TOrder[]; // Массив с отдельным заказом
  orders: TOrder[]; // Массив со всеми заказами
  total: number; // Общее количество заказов
  totalToday: number; // Общее количество заказов на сегодня
  isLoading: boolean; // Флаг загрузки
  error: string | null | unknown; // Ошибка, если она есть
  orderRequest: boolean; // Флаг запроса заказа
};

export const initialState: TOrdersState = {
  order: [],
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  orderRequest: false
};

export const getOrders = createAsyncThunk('order/getOrders', getFeedsApi);

export const getOrder = createAsyncThunk('order/getOrder', getOrderByNumberApi);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getOrderSlice: (state) => state.order, // Селектор для получения отдельного заказа
    getOrdersUser: (state) => state.orders, // Селектор для получения всех заказов
    getTotalSlice: (state) => state.total, // Селектор для получения общего количества заказов
    getTotalTodaySlice: (state) => state.totalToday // Селектор для получения общего количества заказов на сегодня
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload.orders;
        state.isLoading = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      });
  }
});

export const {
  getOrderSlice,
  getOrdersUser,
  getTotalSlice,
  getTotalTodaySlice
} = ordersSlice.selectors;
export const ordersReducer = ordersSlice.reducer;
