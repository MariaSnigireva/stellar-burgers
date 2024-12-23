import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder,RequestStatus  } from '@utils-types';

type TOrdersState = {
  order: TOrder | null; // Изменено на TOrder | null
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null | unknown;
  orderRequest: boolean;
  requestStatus: RequestStatus;
};

type TOrderResponse = {
  success: boolean;
  orders: TOrder[];
};
export const initialState: TOrdersState = {
  order: null,
  orders: [],
  total: 0,
  totalToday: 0,
  requestStatus: RequestStatus.Idle, // Изначально статус Idle
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
            state.requestStatus = RequestStatus.Loading; 
        })
        .addCase(getOrder.rejected, (state, action) => {
            state.error = action.error.message;
            state.requestStatus = RequestStatus.Failed; 
        })
        .addCase(getOrder.fulfilled, (state, action) => {
          
          if (action.payload.orders && action.payload.orders.length > 0) {
              state.order = action.payload.orders[0]; 
          } else {
              state.order = null; 
          }
          state.requestStatus = RequestStatus.Success; 
      })
        .addCase(getOrders.pending, (state) => {
            state.error = null;
            state.requestStatus = RequestStatus.Loading; 
        })
        .addCase(getOrders.rejected, (state, action) => {
            state.error = action.payload;
            state.requestStatus = RequestStatus.Failed; 
        })
        .addCase(getOrders.fulfilled, (state, action) => {
            state.orders = action.payload.orders;
            state.total = action.payload.total;
            state.totalToday = action.payload.totalToday;
            state.requestStatus = RequestStatus.Success; 
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
