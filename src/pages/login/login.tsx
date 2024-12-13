import { FC, FormEvent, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { getIsAuth, loginUser } from '../../components/slices/authSlice';
import { TLoginData } from '../../utils/burger-api';
import { useDispatch, useSelector } from '../../services/store';
import { getCookie, setCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();
  const isAuth = useSelector(getIsAuth);
  const handleSubmit = (e: SyntheticEvent<Element, Event>) => {
    const formEvent = e as FormEvent<HTMLFormElement>;
    formEvent.preventDefault();
    const userLoginData: TLoginData = {
      email,
      password
    };

    dispatch(loginUser({
      email,
      password
    }))
    const accessToken = getCookie('accessToken');
if (accessToken) {
  console.log('Успешно:', accessToken);
} else {
  console.log('Ошибка');
}

    console.log('userLoginData', userLoginData);
    console.log('handleSubmitLogin');
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
