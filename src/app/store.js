import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  notificationsReducer,
  quizzesReducer,
  filieresReducer,
  authReducer,
  coursesReducer,
  coursesformateurReducer,
  competencesSlice,
  scheduleReducer,
  traineesReducer,
  documentsReducer,
  moduleReducer,
  GroupesSlice,
  demandesReducer,
  formateurReducer,
  schedulerReducer,
} from '../features';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  quizzes: quizzesReducer,
  filieres: filieresReducer,
  groups: GroupesSlice,
  competences: competencesSlice,
  auth: authReducer,
  courses: coursesReducer,
  coursesFormateur: coursesformateurReducer,
  schedule: scheduleReducer,
  trainees: traineesReducer,
  documents: documentsReducer,
  modules: moduleReducer,
  demandes: demandesReducer,
  formateurs: formateurReducer,
  scheduler: schedulerReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
