import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [];

const visibleColumnsSlice = createSlice({
  name: 'visibleColumns',
  initialState,
  reducers: {
    setVisibleColumns(state, action: PayloadAction<string[]>) {
      return action.payload;
    },
    toggleColumnVisibility(state, action: PayloadAction<string>) {
      return state.includes(action.payload)
        ? state.filter(colId => colId !== action.payload)
        : [...state, action.payload];
    }
  }
});

export const { setVisibleColumns, toggleColumnVisibility } = visibleColumnsSlice.actions;
export default visibleColumnsSlice.reducer;
