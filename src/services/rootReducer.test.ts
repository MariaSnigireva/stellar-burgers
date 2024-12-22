import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/authSlice';
import { constructorSlice } from './slices/constructorSlice';
import { userOrderSlice } from './slices/mainSlice';
import { ordersSlice } from './slices/ordersSlice';
const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [userOrderSlice.name]: userOrderSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer
});

const setupStore = () => configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

describe('Redux Store Configuration', () => {
  it('Правильная комбинация', () => {
    const store = setupStore();
    const state = store.getState();
    
    expect(state).toHaveProperty(ingredientsSlice.name);
    expect(state).toHaveProperty(userSlice.name);
    expect(state).toHaveProperty(constructorSlice.name);
    expect(state).toHaveProperty(userOrderSlice.name);
    expect(state).toHaveProperty(ordersSlice.name);
  });

  it('Правильная инициализация', () => {
    const store = setupStore();
    const state = store.getState();

    expect(state[ingredientsSlice.name]).toEqual(ingredientsSlice.getInitialState());
    expect(state[userSlice.name]).toEqual(userSlice.getInitialState());
    expect(state[constructorSlice.name]).toEqual(constructorSlice.getInitialState());
    expect(state[userOrderSlice.name]).toEqual(userOrderSlice.getInitialState());
    expect(state[ordersSlice.name]).toEqual(ordersSlice.getInitialState());
  });
});
