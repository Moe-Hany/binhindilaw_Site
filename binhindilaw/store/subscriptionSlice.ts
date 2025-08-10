import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subscribeToNewsletter, SubscriptionResponse, SubscriptionError } from '@/lib/api';

export interface SubscriptionState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  subscribedEmails: string[];
  lastSubscriptionId: string | null;
}

const initialState: SubscriptionState = {
  isLoading: false,
  isSuccess: false,
  error: null,
  subscribedEmails: [],
  lastSubscriptionId: null,
};

// Async thunk for subscribing to newsletter
export const subscribeUser = createAsyncThunk<
  SubscriptionResponse,
  string,
  { rejectValue: string }
>(
  'subscription/subscribeUser',
  async (email, { rejectWithValue, getState }) => {
    const state = getState() as { subscription: SubscriptionState };
    
    // Check if email is already subscribed
    if (state.subscription.subscribedEmails.includes(email)) {
      return rejectWithValue('This email is already subscribed to our newsletter.');
    }

    const result = await subscribeToNewsletter(email);
    
    if ('error' in result) {
      const errorResult = result as SubscriptionError;
      if (errorResult.error.status === 400 && errorResult.error.message.includes('already exists')) {
        return rejectWithValue('This email is already subscribed to our newsletter.');
      }
      return rejectWithValue(errorResult.error.message || 'Failed to subscribe. Please try again.');
    }
    
    return result as SubscriptionResponse;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    resetSubscriptionState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addSubscribedEmail: (state, action: PayloadAction<string>) => {
      if (!state.subscribedEmails.includes(action.payload)) {
        state.subscribedEmails.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(subscribeUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
        state.lastSubscriptionId = action.payload.data.documentId;
        
        // Add email to subscribed emails list
        if (!state.subscribedEmails.includes(action.payload.data.email)) {
          state.subscribedEmails.push(action.payload.data.email);
        }
      })
      .addCase(subscribeUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload || 'An unexpected error occurred';
      });
  },
});

export const { resetSubscriptionState, clearError, addSubscribedEmail } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
