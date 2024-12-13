import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getIngredients = createAsyncThunk('getIngredients', async () => {
  const response = await getIngredientsApi();
  console.log('API Response:', response);
  return response; // Предполагая, что response уже является массивом объектов TIngredient
});

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getIngredients.fulfilled,
      (state, action: PayloadAction<TIngredient[]>) => {
        console.log('Data being saved:', action.payload);
        state.ingredients = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(getIngredients.pending, (state) => {
      state.isLoading = true;
      console.log('getIngredients pending');
    });
    builder.addCase(getIngredients.rejected, (state, action) => {
      console.error('Failed to load ingredients:', action.error.message);
      state.ingredients = [];
      state.isLoading = false;
    });
  }
});

// Экспортируем действия и редюсер
export const { reducer } = ingredientsSlice;

// Селекторы
export const selectIngredients = (state: { ingredients: IngredientsState }) =>
  state.ingredients.ingredients;

export const isLoadingIngredients = (state: { ingredients: IngredientsState }) =>
  state.ingredients.isLoading;

export default reducer;
