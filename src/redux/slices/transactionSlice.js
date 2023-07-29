import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  filterTransactions,
  getCategoryTotals,
  getMonthlyCategoryTotals,
} from '../../utils/api';

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
  try {
    const response = await getTransactions();
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw error;
    }
  }
});

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async transactionData => {
    try {
      const response = await createTransaction(transactionData);
      return response;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw error;
      }
    }
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/removeTransaction',
  async transactionId => {
    try {
      await deleteTransaction(transactionId);
      return transactionId;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw error;
      }
    }
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/editTransaction',
  async ({ id, updatedData }) => {
    try {
      const response = await updateTransaction(id, updatedData);
      return response;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw error;
      }
    }
  }
);

export const fetchFilteredTransactions = createAsyncThunk(
  'transactions/fetchFilteredTransactions',
  async ({ month, year }) => {
    try {
      const response = await filterTransactions(month, year);
      return response;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw error;
      }
    }
  }
);

export const fetchTotals = createAsyncThunk('transactions/fetchTotals', async () => {
  try {
    const response = await getCategoryTotals();
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw error;
    }
  }
});

export const fetchMonthlyTotals = createAsyncThunk(
  'transactions/fetchMonthlyTotals',
  async ({ month, year }) => {
    try {
      const response = await getMonthlyCategoryTotals(month, year);
      return response;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw error;
      }
    }
  }
);

const startLoading = state => {
  state.isLoading = true;
};

const stopLoading = state => {
  state.isLoading = false;
};

const handleSuccess = (state, action) => {
  stopLoading(state);
  state.error = null;
};

const handleError = (state, action) => {
  stopLoading(state);

  if (action.payload) {
    state.error = action.payload;

    toast.error(action.payload);
  } else {
    state.error = action.error.message;

    toast.error(action.error.message);
  }
};
export const transactionsSlice = createSlice({
  name: 'transactions',

  initialState: {
    transactions: [],
    filteredTransactions: [],
    currentTransactionToEdit: {
      id: null,
      amount: 0,
      date: '',
      isIncome: false,
      category: '',
      comment: '',
    },
    totals: {},
    monthlyTotals: {},
    isLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, startLoading)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        handleSuccess(state, action);
      })
      .addCase(fetchTransactions.rejected, handleError)

      .addCase(addTransaction.pending, startLoading)
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        handleSuccess(state, action);
      })
      .addCase(addTransaction.rejected, handleError)

      .addCase(removeTransaction.pending, startLoading)
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t._id !== action.payload);
        handleSuccess(state, action);
      })
      .addCase(removeTransaction.rejected, handleError)

      .addCase(editTransaction.pending, startLoading)
      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t._id === action.payload._id);
        state.transactions[index] = action.payload;
        handleSuccess(state, action);
      })
      .addCase(editTransaction.rejected, handleError)

      .addCase(fetchFilteredTransactions.pending, startLoading)
      .addCase(fetchFilteredTransactions.fulfilled, (state, action) => {
        state.filteredTransactions = action.payload;
        handleSuccess(state, action);
      })
      .addCase(fetchFilteredTransactions.rejected, handleError)

      .addCase(fetchTotals.pending, startLoading)
      .addCase(fetchTotals.fulfilled, (state, action) => {
        state.totals = action.payload;
        handleSuccess(state, action);
      })
      .addCase(fetchTotals.rejected, handleError)

      .addCase(fetchMonthlyTotals.pending, startLoading)
      .addCase(fetchMonthlyTotals.fulfilled, (state, action) => {
        state.monthlyTotals = action.payload;
        handleSuccess(state, action);
      })
      .addCase(fetchMonthlyTotals.rejected, handleError);
  },
});

export default transactionsSlice.reducer;
