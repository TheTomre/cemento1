import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataRow } from '../../types';

const savedData = localStorage.getItem('tableData');

const initialState: { data: DataRow[], sortColumn: string | null, sortOrder: 'asc' | 'desc', searchQuery: string } = {
  data: savedData ? JSON.parse(savedData) : [],
  sortColumn: null,
  sortOrder: 'asc',
  searchQuery: '',
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<DataRow[]>) {
      state.data = action.payload;
      localStorage.setItem('tableData', JSON.stringify(action.payload));
    },
    updateCell(state, action: PayloadAction<{ rowId: string; columnId: string; value: any }>) {
      const { rowId, columnId, value } = action.payload;
      const row = state.data.find(row => row.id === rowId);
      if (row) {
        row[columnId] = value;
        localStorage.setItem('tableData', JSON.stringify(state.data));
      }
    },
    setSortColumn(state, action: PayloadAction<string>) {
      if (state.sortColumn === action.payload) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortColumn = action.payload;
        state.sortOrder = 'asc';
      }
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    deleteRow(state, action: PayloadAction<string>) {
      state.data = state.data.filter(row => row.id !== action.payload);
      localStorage.setItem('tableData', JSON.stringify(state.data));
    }
  }
});

export const { setData, updateCell, setSortColumn, setSearchQuery, deleteRow } = dataSlice.actions;
export default dataSlice.reducer;