import { Preloader } from '@ui';
import { useSelector } from '../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import {
  userSelector,
  authCheck
} from '../services/slices/authSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(authCheck); // Получаем статус проверки аутентификации
  const user = useSelector(userSelector); // Получаем данные пользователя
  const location = useLocation(); // Получаем информацию о текущем местоположении

  if (!isAuthChecked) { // Если аутентификация еще не проверена, отображаем прелоадер
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) { //перенаправляем на страницу входа
    return <Navigate replace to='/login' state={{ from: location }} />; 
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };// устанавливаем главную страницу по умолчанию

    return <Navigate replace to={from} />;
  }

  return children;
};
