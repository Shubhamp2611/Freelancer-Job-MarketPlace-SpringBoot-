import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import contractReducer from './slices/contractSlice';
import proposalReducer from './slices/proposalSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    contracts: contractReducer,
    proposals: proposalReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;