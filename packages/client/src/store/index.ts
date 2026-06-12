import { configureStore } from '@reduxjs/toolkit';

import { reportsApi } from './api/index';

import themeReducer from './slices/theme-slice';
import reportReducer from './slices/report-slice';
import settingsReducer from './slices/settings-slice';

export * from './slices/index';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    report: reportReducer,
    settings: settingsReducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      reportsApi.middleware,
    ),
});

store.subscribe(() => {
  localStorage.setItem('report', JSON.stringify(store.getState().report));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
