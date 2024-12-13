import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ConstructorPage } from '../../pages/constructor-page';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { AppDispatch, useDispatch } from '../../services/store';
import { getIngredients } from '..//slices/ingredientsSlice';
import { ProtectedRoute } from '../protected-route';
import { checkUserAuth } from '../slices/authSlice';
import { getCookie } from '../../utils/cookie';
import '../../index.css';
import styles from './app.module.css';
const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onClose = () => {
    nav(-1);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(checkUserAuth()).unwrap();
        dispatch(getIngredients());
      } catch (error) {
        console.error('Error during user authentication check:', error);
      }
    };
    initializeApp();
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<ProtectedRoute forNotAuth={true}><Login /></ProtectedRoute>} />
        <Route path='/register' element={<ProtectedRoute forNotAuth={true}><Register /></ProtectedRoute>} />
        <Route path='/forgot-password' element={<ProtectedRoute forNotAuth={true}><ForgotPassword /></ProtectedRoute>} />
        <Route path='/reset-password' element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация заказа' onClose={onClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Информация о заказе' onClose={onClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
