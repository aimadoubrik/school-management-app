import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from '../features/notifications/notificationsSlice';
import themeReducer from '../features/theme/themeSlice';

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    theme: themeReducer,
  },
});

export default store;