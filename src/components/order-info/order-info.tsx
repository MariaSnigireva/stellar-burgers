import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getOrderByNumber, selectOrder } from '../slices/ordersSlice';
import { selectIngredients } from '../slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrder);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        acc[item] = acc[item] ? { ...acc[item], count: acc[item].count + 1 } : { ...ingredient, count: 1 };
      }
      return acc;
    }, {} as Record<string, TIngredient & { count: number }>);

    const total = Object.values(ingredientsInfo).reduce((acc, item) => acc + item.price * item.count, 0);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
