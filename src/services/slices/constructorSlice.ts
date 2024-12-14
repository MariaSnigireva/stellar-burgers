import { orderBurgerApi } from '../../utils/burger-api';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, id: key } };
      }
    },
    deleteIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload.id
      );
    },
    moveUp: (state, action) => {
      if (action.payload > 0) {
        state.ingredients.splice(
          action.payload,
          0,
          state.ingredients.splice(action.payload - 1, 1)[0]
        );
      }
    },
    moveDown: (state, action) => {
      if (action.payload < state.ingredients.length) {
        state.ingredients.splice(
          action.payload,
          0,
          state.ingredients.splice(action.payload + 1, 1)[0]
        );
      }
    },
    clearBurgerConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    burger: (state) => state,
    bun: (state) => state.bun,
    otherIngredients: (state) => state.ingredients
  }
});

export const constructorReducer = constructorSlice.reducer;
export const {
  addIngredient,
  deleteIngredient,
  moveUp,
  moveDown,
  clearBurgerConstructor
} = constructorSlice.actions;
export const { burger, bun, otherIngredients } =
  constructorSlice.selectors;
