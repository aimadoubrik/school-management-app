import { configureStore } from '@reduxjs/toolkit';
import QuizzesReducer from '../features/Quiz/quizzesSlice';
const store = configureStore({
  reducer: {
    quizzes : QuizzesReducer
  },
});

export default store;
