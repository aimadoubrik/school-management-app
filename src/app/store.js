import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import competencesSlice from '../features/competences/CompetenceSlice'
import {
  notificationsReducer,
  themeReducer,
  sidebarReducer,
  uiReducer,
  quizzesReducer,
  filieresReducer,
  authReducer,
  
} from '../features';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
  ui: uiReducer,
  quizzes: quizzesReducer,
  filieres: filieresReducer,
  competences: competencesSlice,
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
