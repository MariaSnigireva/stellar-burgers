import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count, index }) => {
    // Добавляем index в аргументы
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        index={index} // Передаем index
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
