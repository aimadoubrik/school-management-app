import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { notificationsReducer, themeReducer, sidebarReducer, uiReducer } from '../features';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
