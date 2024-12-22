import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userSelector } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const user = useSelector(userSelector);
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
