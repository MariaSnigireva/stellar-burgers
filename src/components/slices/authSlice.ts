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

export const userRegistration = createAsyncThunk(
  'userReg',
  async ({ email, name, password }: TRegisterData) => {
    const reg = await registerUserApi({ email, name, password });
    localStorage.setItem('refreshToken', reg.refreshToken);
    setCookie('accessToken', reg.accessToken);
    return reg.user;
  }
);

export const checkUserAuth = createAsyncThunk('checkUserAuth', async (_, { dispatch }) => {
  if (getCookie('accessToken')) {
    try {
      const userApi = await getUserApi();
      dispatch(setUser(userApi.user));
    } finally {
      dispatch(setIsAuth(true));
    }
  } else {
    dispatch(setIsAuth(false)); // Устанавливаем isAuth в false
  }
});

export const loginUser = createAsyncThunk(
  'loginUser',
  async ({ email, password }: TLoginData) => {
    const response = await loginUserApi({ email, password });
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const updateUserAuth = createAsyncThunk(
  'updateUserAuth',
  async ({ email, name, password }: TRegisterData) => {
    await updateUserApi({ email, name, password });
  }
);

export const logoutUser = createAsyncThunk('logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

interface userState {
  user: TUser | null;
  isLoading: boolean;
  isAuth: boolean;
}

const initialState: userState = {
  user: null,
  isLoading: false,
  isAuth: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload; 
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload; 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userRegistration.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userRegistration.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isAuth = true;
    });
    builder.addCase(userRegistration.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(checkUserAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkUserAuth.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(checkUserAuth.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isAuth = true; // Устанавливаем isAuth в true после успешного входа
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuth = false; // Устанавливаем isAuth в false после выхода
    });

    builder.addCase(updateUserAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserAuth.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateUserAuth.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const getUser = (state: { auth: userState }) => state.auth.user;
export const getIsLoading = (state: { auth: userState }) => state.auth.isLoading;
export const getIsAuth = (state: { auth: userState }) => state.auth.isAuth;
export const { setUser, setIsAuth } = authSlice.actions;

export default authSlice.reducer;
