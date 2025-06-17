import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { expenseService } from "../../services/api";

const initialState = {
  expenses: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
  lastQuery: {},
  skip: 0,
  hasMore: true,
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async ({ skip = 0, limit = 9, page = 1, filters = {} } = {}, thunkAPI) => {
    try {
      const { data } = await expenseService.getExpenses({
        skip,
        limit,
        page,
        ...filters,
      });
      return {
        expenses: data.expenses || data,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
        total:
          data.total || (data.expenses ? data.expenses.length : data.length),
        skip,
      };
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch expenses");
    }
  }
);

export const createExpense = createAsyncThunk(
  "expense/createExpense",
  async (expenseData, thunkAPI) => {
    try {
      const response = await expenseService.createExpense(expenseData);
      return response.data.expense;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create expense");
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expense/updateExpense",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await expenseService.updateExpense(id, data);
      return response.data.expense;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update expense");
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (id, thunkAPI) => {
    try {
      await expenseService.deleteExpense(id);
      return id;
    } catch {
      return thunkAPI.rejectWithValue("Failed to delete expense");
    }
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetExpenses: (state) => {
      state.expenses = [];
      state.skip = 0;
      state.hasMore = true;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.lastQuery = action.meta.arg || {};

        const incoming = action.payload.expenses;
        if (action.payload.skip === 0) {
          state.expenses = incoming;
        } else {
          const ids = new Set(state.expenses.map((e) => e._id));
          const newExpenses = incoming.filter((e) => !ids.has(e._id));
          state.expenses = [...state.expenses, ...newExpenses];
        }

        state.hasMore = incoming.length >= (action.meta.arg?.limit || 9);
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        state.expenses = state.expenses.map((exp) =>
          exp._id === action.payload._id ? action.payload : exp
        );
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(
          (exp) => exp._id !== action.payload
        );
        state.total -= 1;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || "Something went wrong";
        }
      );
  },
});

export const selectExpenses = (state) => state.expense.expenses;
export const selectIsLoading = (state) => state.expense.isLoading;
export const selectError = (state) => state.expense.error;
export const selectTotalPages = (state) => state.expense.totalPages;
export const selectCurrentPage = (state) => state.expense.currentPage;
export const selectTotal = (state) => state.expense.total;

export const { clearError, resetExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
