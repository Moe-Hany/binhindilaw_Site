import { configureStore } from '@reduxjs/toolkit';
import navigationSlice from './features/navigationSlice';
import subscriptionSlice from '../store/subscriptionSlice';

export const store = configureStore({
  reducer: {
    navigation: navigationSlice,
    subscription: subscriptionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 