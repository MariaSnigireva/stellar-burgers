import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  authUserRight,
  registerUser
} from '../../services/slices/authSlice';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState(''); // Состояние для имени пользователя
  const [email, setEmail] = useState(''); // Состояние для email
  const [password, setPassword] = useState(''); // Состояние для пароля

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authUserRight);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      return;
    }
    dispatch(registerUser({ email, name: userName, password }));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
