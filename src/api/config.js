// src/config/api.js
import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    FILIERES: '/filieres',
    GROUPES: '/groupes',
    // Add other endpoints here
  },
  TIMEOUT: 15000, // 15 seconds
};

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.timeout = API_CONFIG.TIMEOUT;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for common handling
axios.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for common error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiry or auth errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API error handling helper
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data?.message || getErrorMessage(error.response.status);
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data,
    });
    return {
      message,
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response:', error.request);
    return {
      message: 'Pas de réponse du serveur. Veuillez vérifier votre connexion.',
      status: 0,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Setup Error:', error.message);
    return {
      message: 'Erreur lors de la configuration de la requête.',
      status: -1,
    };
  }
};

// Helper function to get error messages based on status codes
const getErrorMessage = (status) => {
  const messages = {
    400: 'Requête invalide. Veuillez vérifier les données saisies.',
    401: 'Non autorisé. Veuillez vous reconnecter.',
    403: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
    404: 'Ressource non trouvée.',
    408: "Délai d'attente dépassé. Veuillez réessayer.",
    500: 'Erreur serveur. Veuillez réessayer plus tard.',
    502: 'Service temporairement indisponible. Veuillez réessayer plus tard.',
    503: 'Service indisponible. Veuillez réessayer plus tard.',
    504: "Délai d'attente du serveur dépassé. Veuillez réessayer.",
  };
  return messages[status] || 'Une erreur est survenue. Veuillez réessayer.';
};

// API request helper functions
export const createApiRequest = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Reusable API functions
export const apiService = {
  get: (endpoint, config = {}) => createApiRequest('get', endpoint, null, config),
  post: (endpoint, data, config = {}) => createApiRequest('post', endpoint, data, config),
  put: (endpoint, data, config = {}) => createApiRequest('put', endpoint, data, config),
  delete: (endpoint, config = {}) => createApiRequest('delete', endpoint, null, config),
  // Add more methods as needed
};

// Environment-specific configuration
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export constants for use in services
export const API_ENDPOINTS = {
  ...API_CONFIG.ENDPOINTS,
  // Add computed endpoints here
  FILIERE_BY_ID: (id) => `${API_CONFIG.ENDPOINTS.FILIERES}/${id}`,
  FILIERE_GROUPES: (filiereId) => `${API_CONFIG.ENDPOINTS.FILIERES}/${filiereId}/groupes`,
};
