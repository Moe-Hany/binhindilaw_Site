import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  isMenuOpen: boolean;
  isServicesOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
}

const initialState: NavigationState = {
  isMenuOpen: false,
  isServicesOpen: false,
  isSearchOpen: false,
  searchQuery: '',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
    toggleServices: (state) => {
      state.isServicesOpen = !state.isServicesOpen;
    },
    closeServices: (state) => {
      state.isServicesOpen = false;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
      if (!state.isSearchOpen) {
        state.searchQuery = '';
      }
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
      state.searchQuery = '';
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetNavigation: (state) => {
      state.isMenuOpen = false;
      state.isServicesOpen = false;
      state.isSearchOpen = false;
      state.searchQuery = '';
    },
  },
});

export const {
  toggleMenu,
  closeMenu,
  toggleServices,
  closeServices,
  toggleSearch,
  closeSearch,
  setSearchQuery,
  resetNavigation,
} = navigationSlice.actions;

export default navigationSlice.reducer; 