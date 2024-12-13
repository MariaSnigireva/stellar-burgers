import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { getConstructorItems } from '../slices/constructorSlice';

export const IngredientsCategory = forwardRef<HTMLUListElement, TIngredientsCategoryProps>(
  ({ title, titleRef, ingredients }, ref) => {
    const burgerConstructor = useSelector(getConstructorItems);

    const ingredientsCounters = useMemo(() => {
      if (!burgerConstructor) return {}; 

      const { bun, ingredients: constructorIngredients } = burgerConstructor;
      const counters: { [key: string]: number } = {};
      
      constructorIngredients.forEach((ingredient: TIngredient) => {
        counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
      });
      
      if (bun) {
        counters[bun._id] = (counters[bun._id] || 0) + 2;
      }

      return counters;
    }, [burgerConstructor]);

    return (
      <IngredientsCategoryUI
        title={title}
        titleRef={titleRef}
        ingredients={ingredients}
        ingredientsCounters={ingredientsCounters}
        ref={ref}
      />
    );
  }
);
