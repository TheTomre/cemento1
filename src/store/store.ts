import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../features/table/dataSlice';
import visibleColumnsReducer from '../features/table/visibleColumnsSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    visibleColumns: visibleColumnsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
