import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import notificationsReducer from '../features/notifications/notificationsSlice';
import themeReducer from '../features/theme/themeSlice';
import sidebarReducer from '../features/sidebar/sidebarSlice';
import uiReducer from '../features/ui/uiSlice';
import QuizzesReducer from '../features/Quiz/quizzesSlice';


const rootReducer = combineReducers({
  notifications: notificationsReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
  ui: uiReducer,
  quizzes : QuizzesReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;