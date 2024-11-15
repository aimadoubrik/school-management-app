import axios from 'axios';
import { API_CONFIG } from '../../api/config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILIERES}`;

// Get all filieres
const getFilieres = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add new filiere
const addFiliere = async (filiereData) => {
  const response = await axios.post(API_URL, filiereData);
  return response.data;
};

// Update filiere
const updateFiliere = async (filiere) => {
  const response = await axios.put(`${API_URL}/${filiere.id}`, filiere);
  return response.data;
};

// Delete filiere
const deleteFiliere = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

const filiereService = {
  getFilieres,
  addFiliere,
  updateFiliere,
  deleteFiliere,
};

export default filiereService;
