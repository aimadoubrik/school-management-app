import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import notificationsReducer from '../features/notifications/notificationsSlice';
import themeReducer from '../features/theme/themeSlice';
import sidebarReducer from '../features/sidebar/sidebarSlice';
import uiReducer from '../features/ui/uiSlice';

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
