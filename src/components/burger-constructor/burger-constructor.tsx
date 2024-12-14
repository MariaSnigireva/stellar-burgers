import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  bun,
  otherIngredients,
  clearBurgerConstructor
} from '../../services/slices/constructorSlice';
import {
  orderRequest,
  sendUserOrder,
  orderSelector,
  clearOrder
} from '../../services/slices/mainSlice';
import { authUserRight } from '../../services/slices/authSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(authUserRight);
  const constructorItems = {
    bun: useSelector(bun),
    ingredients: useSelector(otherIngredients)
  };

  const orderUserRequest = useSelector(orderRequest);

  const orderModalData = useSelector(orderSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderUserRequest) return;
    if (isAuthenticated) {
      const orderData = [
        constructorItems.bun?._id,
        ...constructorItems.ingredients.map((ingredient) => ingredient._id)
      ];
      dispatch(sendUserOrder(orderData));
    } else {
      navigate('/login');
    }
  };
  const closeOrderModal = () => {
    dispatch(clearBurgerConstructor());
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderUserRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
