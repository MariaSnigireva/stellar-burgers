import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userOrderReducer } from './slices/mainSlice';
import { userReducer } from './slices/authSlice';
import { ordersReducer } from './slices/ordersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer, // Состояние ингредиентов
  burgerConstructor: constructorReducer, // Состояние конструктора бургера
  userOrder: userOrderReducer, // Состояние заказа пользователя
  user: userReducer, // Состояние пользователя
  orders: ordersReducer // Состояние всех заказов
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
