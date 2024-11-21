import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompetences,
  deleteCompetence,
  addCompetence,
  editCompetence,
} from '../../features/competences/competencesSlice';
import { Eye, Edit, Trash, Download, Plus, Search } from 'lucide-react';
import { LoadingSpinner, ErrorAlert } from '../../components';
import Papa from 'papaparse';
import CompetenceTable from './components/CompetencesTable';
import CompetencesModal from './components/CompetencesModal';
import { ConfirmModal } from '../../components';

const CompetencesPage = () => {
  const dispatch = useDispatch();
  const { competences = [], loading, error } = useSelector((state) => state.competences);
  const [selectedCompetence, setSelectedCompetence] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [competenceToDelete, setCompetenceToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [filieres, setFilieres] = useState([]);
  const [modules, setModules] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(competences.length / itemsPerPage);

  useEffect(() => {
    dispatch(fetchCompetences());
  }, [dispatch]);

  useEffect(() => {
    const uniqueFilieres = [...new Set(competences.map((competence) => competence.filiere))];
    setFilieres(uniqueFilieres);

    if (selectedFiliere) {
      const filteredModules = competences
        .filter((competence) => competence.filiere === selectedFiliere)
        .map((competence) => competence.intitule_module);
      setModules([...new Set(filteredModules)]);
    } else {
      setModules([]);
    }
  }, [competences, selectedFiliere]);

  const handleDeleteCompetence = (competence) => {
    setCompetenceToDelete(competence);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteCompetence(competenceToDelete.id));
      setIsDeleteModalOpen(false);
      setCompetenceToDelete(null);
    } catch (error) {
      console.error('Error deleting competence:', error.message);
    }
  };

  const handleSaveCompetence = async (competenceData) => {
    try {
      if (selectedCompetence) {
        // Update existing competence
        await dispatch(editCompetence(competenceData));
      } else {
        // Add new competence
        await dispatch(addCompetence(competenceData));
      }
      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error('Error saving competence:', error);
    }
  };

  const handleEdit = (competence) => {
    setSelectedCompetence(competence); // Set the selected competence for editing
    setViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (competence) => {
    setSelectedCompetence(competence); // Set the selected competence for viewing
    setViewMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCompetence(null); // Clear selected competence
    setIsModalOpen(false); // Close the modal
  };

  const handleCSVExport = () => {
    const csv = Papa.unparse(competences);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'competences.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCompetences = competences.filter((competence) => {
    const matchesSearch = competence.intitule_competence.some((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFiliere = selectedFiliere ? competence.filiere === selectedFiliere : true;
    const matchesModule = selectedModule ? competence.intitule_module === selectedModule : true;
    return matchesSearch && matchesFiliere && matchesModule;
  });

  const displayedCompetences = filteredCompetences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <LoadingSpinner message="Fetching competences..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <ErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Element de Competence</h1>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-1/4">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search competences..."
            className="input input-bordered w-full pl-10"
          />
        </div>

        <div className="w-1/4">
          <select
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="">Select Filiere</option>
            {filieres.map((filiere, index) => (
              <option key={index} value={filiere}>
                {filiere}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/4">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="">Select Module</option>
            {modules.map((module, index) => (
              <option key={index} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Competence and CSV Export */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setSelectedCompetence(null); // Assurez-vous que `selectedCompetence` est bien null
            setViewMode(false); // Mode non-lecture
            setIsModalOpen(true); // Ouvre la modale
          }}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-5 h-5" /> Add Competence
        </button>

        <button onClick={handleCSVExport} className="btn btn-accent gap-2">
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <hr />

      {/* Competence Table */}
      <CompetenceTable
        competences={displayedCompetences}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteCompetence}
      />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>

      {/* Competences Modal */}
      <CompetencesModal
        isOpen={isModalOpen}
        mode={viewMode ? 'view' : selectedCompetence ? 'edit' : 'add'}
        competence={selectedCompetence}
        onClose={handleCloseModal}
        onSave={handleSaveCompetence}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la compétence"
        message={`Êtes-vous sûr de vouloir supprimer la compétence "${competenceToDelete?.intitule_competence}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default CompetencesPage;
