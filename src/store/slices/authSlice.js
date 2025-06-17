import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/api";

const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  user: null,
  token: tokenFromStorage,
  isLoading: false,
  isAuthenticated: !!tokenFromStorage,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await authService.login(email, password);
      const { token, user, message } = response.data;
      localStorage.setItem("token", token);
      return { user, token, message }; // include message
    } catch (error) {
      // Try to get message from API error response
      const apiMsg = error?.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(apiMsg);
    }
  }
);

export const register = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await authService.register(name, email, password);
      const { token, user, message } = response.data;
      localStorage.setItem("token", token);
      return { user, token, message }; // include message
    } catch (error) {
      const apiMsg = error?.response?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue(apiMsg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
