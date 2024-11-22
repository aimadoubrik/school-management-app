import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompetences,
  deleteCompetence,
  addCompetence,
  editCompetence,
} from '../../features/competences/competencesSlice';
import { Eye, Edit, Trash, Download, Plus, Search, Filter } from 'lucide-react';
import { LoadingSpinner, ErrorAlert } from '../../components';
import Papa from 'papaparse';
import CompetenceTable from './components/CompetencesTable';
import CompetencesModal from './components/CompetencesModal';
import { ConfirmModal } from '../../components';
import CompetenceHeader from './components/CompetenceHeader';
import { SearchFilter } from '../../components';
import Pagination from '../../components/shared/Pagination';

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
        await dispatch(editCompetence(competenceData));
      } else {
        await dispatch(addCompetence(competenceData));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving competence:', error);
    }
  };

  const handleEdit = (competence) => {
    setSelectedCompetence(competence);
    setViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (competence) => {
    setSelectedCompetence(competence);
    setViewMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCompetence(null);
    setIsModalOpen(false);
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

  const handleRefresh = () => {
    dispatch(fetchCompetences());
  };

  // Filter competences based on search, filieres, and modules
  const filteredCompetences = competences.filter((competence) => {
    const title = competence.intitule_competence || '';
    const filiereMatch = selectedFiliere ? competence.filiere === selectedFiliere : true;
    const moduleMatch = selectedModule ? competence.intitule_module === selectedModule : true;
    const searchMatch = searchTerm ? title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    return searchMatch && filiereMatch && moduleMatch;
  });

  const totalPages = Math.ceil(filteredCompetences.length / itemsPerPage);
  const displayedCompetences = filteredCompetences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const modalMode = selectedCompetence ? (viewMode ? 'view' : 'edit') : 'add';

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
    <div className="container mx-auto p-6 space-y-6">
      <CompetenceHeader
        onRefresh={handleRefresh}
        onExport={handleCSVExport}
        onAdd={() => setIsModalOpen(true)}
      />

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        filters={[
          {
            key: 'filiere',
            value: selectedFiliere,
            options: filieres,
            placeholder: 'Select Filiere',
          },
          { key: 'module', value: selectedModule, options: modules, placeholder: 'Select Module' },
        ]}
        onSearchChange={setSearchTerm}
        onFilterChange={(key, value) => {
          if (key === 'filiere') {
            setSelectedFiliere(value);
            setSelectedModule('');
          } else if (key === 'module') {
            setSelectedModule(value);
          }
        }}
        searchPlaceholder="Rechercher par code ou intitulé..."
        icons={{ SearchIcon: Filter }}
      />

      <hr />

      {/* Competence Table */}
      <CompetenceTable
        competences={displayedCompetences}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteCompetence}
      />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Competences Modal */}
      <CompetencesModal
        isOpen={isModalOpen}
        mode={modalMode}
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
