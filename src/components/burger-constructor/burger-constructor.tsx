import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, deleteOrder, selectLoading, selectOrder } from '../slices/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getIsAuth, getUser } from '../slices/authSlice';
import { getConstructorItems, selectOrderModalData, selectOrderRequest } from '../slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector(getIsAuth);
  const constructorItems = useSelector(getConstructorItems); 
  const user = useSelector(getUser); 
  const orderLoading = useSelector(selectOrderRequest);
  const orderModal = useSelector(selectOrder);
  
  const onOrderClick = () => {
    if (!user) {
      return navigate('/login');
    }
    if (!constructorItems.bun || constructorItems.ingredients.length === 0 || orderLoading) return;

    const order = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((it) => it._id),
      constructorItems.bun?._id
    ].filter(Boolean);

    dispatch(createOrder(order));
  };

  const closeOrderModal = () => {
    dispatch(deleteOrder());
    navigate('/');
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (total: number, ingredient: TConstructorIngredient) => total + ingredient.price,
      0
    );
    
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderLoading}
      constructorItems={constructorItems}
      orderModalData={orderModal}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
