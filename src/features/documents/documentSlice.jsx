import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  loading: false,
  error: null,
  requests: [],
  showSuccessAlert: false,
  selectedDocument: null,
  requestDate: '',
  files: [],
  isFormValid: false,
};

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    handleDocumentSelect: (state, action) => {
      state.selectedDocument = action.payload;
    },
    setRequestDate: (state, action) => {
      state.requestDate = action.payload;
    },
    handleFileChange: (state, action) => {
      state.files = action.payload;
    },
    setIsFormValid: (state, action) => {
      state.isFormValid = action.payload;
    },
    handleSubmitRequest: (state) => {
      if (state.selectedDocument && state.requestDate && state.files.length > 0) {
        const newRequest = {
          id: Date.now().toString(),
          document: state.selectedDocument.name,
          description: state.selectedDocument.description,
          files: state.files.map(file => file.name),
          submissionDate: new Date().toISOString(),
          requestDate: state.requestDate,
          processingTime: state.selectedDocument.processingTime,
          status: 'en cours', // initial status
        };
        state.requests.push(newRequest);
        state.showSuccessAlert = true;
        state.selectedDocument = null;
        state.requestDate = '';
        state.files = [];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { handleDocumentSelect, setRequestDate, handleFileChange, setIsFormValid, handleSubmitRequest, clearError } = documentSlice.actions;
export default documentSlice.reducer;
