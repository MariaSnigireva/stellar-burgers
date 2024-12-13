import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, deleteOrder, selectLoading, selectOrder } from '../slices/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { checkUserAuth, getIsAuth, getUser } from '../slices/authSlice';
import { getConstructorItems, selectOrderModalData, selectOrderRequest } from '../slices/constructorSlice';

export const BurgerConstructor: FC = () => {
const dispatch = useDispatch();

console.log('Current state:', useSelector(state => state));

const isAuth = useSelector(getIsAuth); //авторизован ли
const checkAuth = useSelector(checkUserAuth);//аутентификация
const constructorItems = useSelector(getConstructorItems); 
const user = useSelector(getUser); 

const orderLoading = useSelector(selectOrderRequest);
const orderModal = useSelector(selectOrder);
console.log('orderModal', orderModal);

const navigate = useNavigate();

const onOrderClick = () => {
  if (!user) {//если не авторизован, то перенаправляем
    return navigate('/login');
  }
  if (!constructorItems.bun || orderLoading) return;

  const order = [
    constructorItems.bun?._id,
    ...constructorItems.ingredients.map((it) => it._id),
    constructorItems.bun?._id
  ].filter(Boolean);

  dispatch(createOrder(order));
};


console.log('Current state:', useSelector(state => state));


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
