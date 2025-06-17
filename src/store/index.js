import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
