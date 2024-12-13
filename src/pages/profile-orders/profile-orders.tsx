import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { getFeed, selectOrders } from '../../components/slices/mainSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders } from '../../components/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const orders: TOrder[] = useSelector(selectOrders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(getFeed()), dispatch(getOrders())]);
        console.log('profile orders fetched successfully');
      } catch (error) {
        setError('Ошибка при загрузке заказов. Попробуйте снова позже.');
        console.error('Error fetching orders', error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <ProfileOrdersUI orders={orders} />
    </>
  );
};
