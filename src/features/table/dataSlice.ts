// src/features/table/dataSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataRow } from '../../types';

const savedData = localStorage.getItem('tableData');

const initialState: DataRow[] = savedData ? JSON.parse(savedData) : [];

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<DataRow[]>) {
      localStorage.setItem('tableData', JSON.stringify(action.payload));
      return action.payload;
    },
    updateCell(state, action: PayloadAction<{ rowId: string; columnId: string; value: any }>) {
      const { rowId, columnId, value } = action.payload;
      const row = state.find(row => row.id === rowId);
      if (row) {
        row[columnId] = value;
        localStorage.setItem('tableData', JSON.stringify(state));
      }
    }
  }
});

export const { setData, updateCell } = dataSlice.actions;
export default dataSlice.reducer;
