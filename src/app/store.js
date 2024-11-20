import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  notificationsReducer,
  themeReducer,
  quizzesReducer,
  filieresReducer,
  authReducer,
  coursesReducer,
  competencesSlice,
  scheduleReducer,
  profileSlice,
  documentsReducer,
  moduleReducer,
} from '../features';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  theme: themeReducer,
  quizzes: quizzesReducer,
  filieres: filieresReducer,
  competences: competencesSlice,
  auth: authReducer,
  courses: coursesReducer,
  schedule: scheduleReducer,
  profile: profileSlice,
  documents: documentsReducer,
  modules: moduleReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
