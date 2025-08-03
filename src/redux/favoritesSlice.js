import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite articles
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
      toggleFavorite: (state, action) => {
      // Check if the recipe already exists in favorites
      const index = state.favoriterecipes.findIndex(
        (recipe) => recipe.idFood === action.payload.idFood
      );
      
      if (index >= 0) {
        // Recipe exists - remove it from favorites
        state.favoriterecipes.splice(index, 1);
      } else {
        // Recipe doesn't exist - add it to favorites
        state.favoriterecipes.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
