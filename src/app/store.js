import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { notificationsReducer, themeReducer, sidebarReducer, uiReducer } from '../features';
import QuizzesReducer from '../features/quizzes/quizzesSlice';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
  ui: uiReducer,
  quizzes: QuizzesReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
