import { createSelector, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/config';

const initialState = {
  quizzes: [],
  questions: {},
  questionAnswers: [], // Add questionAnswers to track answers
  courses: [],
  status: 'idle',
  error: null,
};

export const selectCoursesData = (state) => state.courses?.coursess || [];
export const selectMemoizedCourses = createSelector([selectCoursesData], (coursesData) =>
  coursesData.map((course) => ({
    courseId: course.courseId,
    courseName: course.courseName,
  }))
);

// Thunks for fetching and manipulating quizzes and questions
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.get('/quizzes');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Other thunks here (addQuiz, updateQuiz, etc.)

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add a new action to update questionAnswers
    updateQuestionAnswers: (state, action) => {
        // Directly replace the current questionAnswers array with the new one
        state.questionAnswers = action.payload;
    },
    // Add an action to clear the question answers (e.g., for retrying the quiz)
    clearQuestionAnswers: (state) => {
      state.questionAnswers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Other reducers like addQuiz, deleteQuiz, etc.
  },
});

export const { clearError, updateQuestionAnswers, clearQuestionAnswers } = quizzesSlice.actions;

export default quizzesSlice.reducer;
