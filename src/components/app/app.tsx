import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <ConstructorPage />
  </div>
);

export default App;
