import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: string | null | undefined;
  loginUserRequest: boolean;
  isLoading: boolean;
  error: string | null;
  user: TUser | null;
};

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/loginUser',
  async (data) => {
    const userData = await loginUserApi(data);
    setCookie('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    return userData.user;
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/registerUser',
  async (data) => {
    const userData = await registerUserApi(data);
    setCookie('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    return userData.user;
  }
);

export const getUser = createAsyncThunk<TUser, void>(
  'user/getUser',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: TUser) => await updateUserApi(user)
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  isLoading: false,
  error: null,
  user: null
};
type TUserResponse = {
  user: TUser;
};

export const fetchUser = createAsyncThunk<TUser, void>(
  'user/fetchUser',
  async () => {
    const response: TUserResponse = await getUserApi();
    return response.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    userSelector: (state) => state.data,
    authCheck: (state) => state.isAuthChecked,
    authUserRight: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Fetch user failed';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Fetch user failed';
      });
  }
});

export const userReducer = userSlice.reducer;
export const { userSelector, authCheck, authUserRight } = userSlice.selectors;
