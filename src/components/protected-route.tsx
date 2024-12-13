import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "../components/store";
import { getIsAuth, getUser } from "../components/slices/authSlice";
import { Preloader } from "@ui";

interface ProtectedRouteProps {
  children: JSX.Element;
  forNotAuth?: boolean;
}

export function ProtectedRoute({ children, forNotAuth }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useSelector(getUser);

  // Проверка, загружаются ли данные о пользователе
  if (user === undefined) {
    return <Preloader />; // Показываем прелоадер
  }

  // Если пользователь не авторизован 
  if (!forNotAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если пользователь авторизован 
  if (forNotAuth && user) {
    return <Navigate to='/' state={{ from: location }} />;
  }

  return children; 
}
