import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { proposalAPI } from '../../api/proposalAPI';  // Changed from 'api' to '{ proposalAPI }'

export const submitProposal = createAsyncThunk(
  'proposals/submit',
  async (proposalData, { rejectWithValue }) => {
    try {
      const response = await proposalAPI.submitProposal(proposalData);  // Changed from api to proposalAPI
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProposalsByJob = createAsyncThunk(
  'proposals/getByJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await proposalAPI.getProposalsByJob(jobId);  // Changed from api to proposalAPI
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const acceptProposal = createAsyncThunk(
  'proposals/accept',
  async ({ proposalId, message }, { rejectWithValue }) => {
    try {
      const response = await proposalAPI.acceptProposal(proposalId, message);  // Changed from api to proposalAPI
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const proposalSlice = createSlice({
  name: 'proposals',
  initialState: {
    list: [],
    selectedProposal: null,
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
      .addCase(submitProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(submitProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProposalsByJob.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});

export const { clearError } = proposalSlice.actions;
export default proposalSlice.reducer;