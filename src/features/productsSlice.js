import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    toggleBought: (state, action) => {
      const product = state.products.find(p => p.id === action.payload);
      if (product) {
        product.bought = !product.bought;
      }
    },
  },
});

export const { addProduct, toggleBought } = productsSlice.actions;
export default productsSlice.reducer;
