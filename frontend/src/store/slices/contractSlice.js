import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contractAPI } from '../../api/contractAPI';  // Changed from 'api' to '{ contractAPI }'

export const createContract = createAsyncThunk(
  'contracts/create',
  async (contractData, { rejectWithValue }) => {
    try {
      const response = await contractAPI.createContract(contractData);  // Changed from api to contractAPI
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getMyContracts = createAsyncThunk(
  'contracts/getMyContracts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contractAPI.getMyContracts();  // Changed from api to contractAPI
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getContractById = createAsyncThunk(
  'contracts/getById',
  async (contractId, { rejectWithValue }) => {
    try {
      const response = await contractAPI.getContractById(contractId);  // Changed from api to contractAPI
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const contractSlice = createSlice({
  name: 'contracts',
  initialState: {
    list: [],
    selectedContract: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyContracts.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getContractById.fulfilled, (state, action) => {
        state.selectedContract = action.payload;
      });
  }
});

export const { clearError } = contractSlice.actions;
export default contractSlice.reducer;