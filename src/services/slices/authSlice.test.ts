import {
  userReducer,
  fetchUser,
  initialState,
  loginUser,
  registerUser,
  getUser,
  logoutUser
} from './authSlice';
import * as api from '@api';
import { TUser } from '@utils-types';
import React from 'react';
// Моковые данные для тестов
const mockUser: TUser = {
  email: 'Masch.dark@yandex.ru',
  name: 'Mary'
};

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

type TRegisterData = {
  email: string;
  password: string;
  name: string;
};

type TLoginData = {
  email: string;
  password: string;
};

describe('tests for userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle registerUser.pending', () => {
    const registerData: TRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const nextState = userReducer(
      initialState,
      registerUser.pending('', registerData)
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null); // Ожидаем null
  });

  it('should handle registerUser.fulfilled', async () => {
    (api.registerUserApi as jest.Mock).mockResolvedValueOnce({
      accessToken: 'token',
      refreshToken: 'refreshToken',
      data: mockUser
    });

    const registerData: TRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const nextState = await userReducer(
      initialState,
      await registerUser.fulfilled(mockUser, '', registerData)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.data).toEqual(mockUser);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(false);
  });

  it('should handle registerUser.rejected', async () => {
    const errorMessage = 'Registration failed';
    (api.registerUserApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const registerData: TRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const nextState = await userReducer(
      initialState,
      await registerUser.rejected(new Error(errorMessage), '', registerData)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  it('should handle loginUser.pending', () => {
    const loginData: TLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const nextState = userReducer(
      initialState,
      loginUser.pending('', loginData)
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null); // Ожидаем null
  });

  it('should handle loginUser.fulfilled', async () => {
    (api.loginUserApi as jest.Mock).mockResolvedValueOnce({
      accessToken: 'token',
      refreshToken: 'refreshToken',
      data: mockUser
    });

    const loginData: TLoginData = {
      email: mockUser.email,
      password: 'password123'
    };

    const nextState = await userReducer(
      initialState,
      await loginUser.fulfilled(mockUser, '', loginData)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.data).toEqual(mockUser);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(false);
  });

  it('should handle loginUser.rejected', async () => {
    const errorMessage = 'Login failed';
    (api.loginUserApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const loginData: TLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const nextState = await userReducer(
      initialState,
      await loginUser.rejected(new Error(errorMessage), '', loginData)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  it('should handle fetchUser.pending', () => {
    const nextState = userReducer(initialState, fetchUser.pending(''));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null); // Ожидаем null
  });

  it('should handle fetchUser.fulfilled', async () => {
    (api.getUserApi as jest.Mock).mockResolvedValueOnce({ data: mockUser });

    const nextState = await userReducer(
      initialState,
      await fetchUser.fulfilled(mockUser, '')
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.data).toEqual(mockUser);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(false);
  });

  it('should handle fetchUser.rejected', async () => {
    const errorMessage = 'Fetch user failed';
    (api.getUserApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const nextState = await userReducer(
      initialState,
      await fetchUser.rejected(new Error(errorMessage), '')
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  it('should handle logoutUser.pending', () => {
    const nextState = userReducer(
      initialState,
      logoutUser.pending('', undefined)
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null); // Ожидаем null
  });

  it('should handle logoutUser.fulfilled', async () => {
    const modifiedState = {
      ...initialState,
      isLoading: true,
      data: mockUser,
      error: 'Some error'
    };

    const nextState = userReducer(
      modifiedState,
      await logoutUser.fulfilled(undefined, '')
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.data).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isAuthChecked).toBe(false);
  });

  it('should handle logoutUser.rejected', async () => {
    const errorMessage = 'Logout failed';
    const action = {
      type: logoutUser.rejected.type,
      error: { message: errorMessage }
    };

    const modifiedState = {
      ...initialState,
      isLoading: true
    };

    const nextState = userReducer(modifiedState, action);
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });
});
