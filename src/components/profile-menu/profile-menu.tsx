import { FC, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getIsAuth, logoutUser } from '../slices/authSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const isAuth = useSelector(getIsAuth);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser());
      nav('/');
    } catch (error) {
      console.error('Error during logout', error);
    }
  }, [dispatch, nav]);

  useEffect(() => {
    if (!isAuth) {
      nav('/login');
    }
  }, [isAuth, nav]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
