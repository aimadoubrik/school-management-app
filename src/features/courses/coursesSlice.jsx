import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching courses data
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const response = await axios.get('http://localhost:3000/courses');
  return response.data;
});

// Slice for managing course state
const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    status: 'idle', // Represents the status of the async operation
    error: null, // Holds any errors encountered during fetch
  },
  reducers: {
    // Action to mark a course as completed
    markAsCompleted: (state, action) => {
      const courseId = action.payload;
      const course = state.courses.find((course) => course.id === courseId);
      if (course) {
        course.status = 'completed'; // Update course status to "completed"
      }
    },
    // Action to manually set courses
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading'; // Set status to loading when fetch is in progress
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded on successful fetch
        state.courses = action.payload; // Store fetched courses in state
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed if there was an error
        state.error = action.error.message; // Store the error message
      });
  },
});

// Export actions
export const { markAsCompleted, setCourses } = courseSlice.actions;

// Export the reducer for store configuration
export default courseSlice.reducer;
