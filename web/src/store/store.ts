// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import surveyReducer from './surveySlice';

const store = configureStore({
  reducer: {
    survey: surveyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
