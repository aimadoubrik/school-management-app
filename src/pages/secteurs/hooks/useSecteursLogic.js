import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deletesecteur, editsecteur, addsecteur } from '../../../features/secteur/secteurslice';

export const useSecteursLogic = (Secteurs) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [SecteurToDelete, setSecteurToDelete] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([
    {
      key: 'secteur',
      value: '',
      placeholder: 'Tous les secteurs',
      options: [],
    },
  ]);
  const [sortConfig, setSortConfig] = useState({ key: 'code_Secteur', direction: 'asc' });

  // Update filter options whenever `Secteurs` changes
  useEffect(() => {
    if (Secteurs && Secteurs.length > 0) {
      setFilters((prevFilters) => [
        {
          ...prevFilters[0], // Spread the existing filter config (if any)
          options: [...new Set(Secteurs.map((f) => f.secteur))], // Get unique secteurs
        },
      ]);
    }
  }, [Secteurs]);

  // Memoized filtered and sorted Secteurs
  const filteredAndSortedSecteurs = useMemo(() => {
    let result = [...Secteurs]; // Create a shallow copy of the Secteurs array

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (Secteur) =>
          Secteur.code_Secteur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Secteur.intitule_Secteur?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Dynamic filters
    filters.forEach((filter) => {
      if (filter.value) {
        result = result.filter((Secteur) => Secteur[filter.key] === filter.value);
      }
    });

    // Sorting
    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      result = result.sort((a, b) => {
        const aValue = a[key] || '';
        const bValue = b[key] || '';
        return (direction === 'asc' ? 1 : -1) * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
      });
    }

    return result;
  }, [Secteurs, searchTerm, filters, sortConfig]);

  // Handle sorting logic
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filter changes (e.g., sector filter)
  const handleFilterChange = (key, value) => {
    setFilters((prev) =>
      prev.map((filter) => (filter.key === key ? { ...filter, value } : filter))
    );
  };

  // Open modal for editing or viewing Secteur
  const handleModalOpen = (Secteur, mode) => {
    setSelectedSecteur(Secteur);
    setViewMode(mode === 'view');
    setIsModalOpen(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSecteur(null);
    setViewMode(false);
  };

  // Handle click on delete button
  const handleDeleteClick = (Secteur) => {
    setSecteurToDelete(Secteur);
    setIsDeleteModalOpen(true);
  };

  // Cancel delete operation
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSecteurToDelete(null);
  };

  // Confirm delete operation
  const handleDeleteConfirm = async () => {
    if (!SecteurToDelete) return;

    try {
      await dispatch(deletesecteur(SecteurToDelete.id)).unwrap();
      setIsDeleteModalOpen(false);
      setSecteurToDelete(null);
      handleModalClose(); // Close the view modal if open
    } catch (error) {
      console.error('Failed to delete Secteur:', error);
      alert('Erreur lors de la suppression de la secteur');
    }
  };

  // Save or edit Secteur data
  const handleSave = async (SecteurData) => {
    try {
      if (SecteurData.id) {
        await dispatch(editsecteur(SecteurData)).unwrap();
      } else {
        await dispatch(addsecteur(SecteurData)).unwrap();
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to save Secteur:', error);
      throw new Error("Erreur lors de l'enregistrement de la secteur");
    }
  };

  // Export filtered and sorted Secteurs to CSV
  const exportSecteurs = () => {
    const headers = ['Code Secteur', 'Intitule Secteur', 'Secteur', 'Groupes'];
    const rows = filteredAndSortedSecteurs.map((Secteur) => [
      Secteur.code_Secteur,
      Secteur.intitule_Secteur,

      Array.isArray(Secteur.niveaux.Specialisation.filiere) ? Secteur.groupes.join(';') : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Secteurs_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return {
    isModalOpen,
    isDeleteModalOpen,
    SecteurToDelete,
    viewMode,
    selectedSecteur,
    searchTerm,
    filters,
    sortConfig,
    filteredAndSortedSecteurs,
    handleSort,
    handleSearch,
    handleFilterChange,
    handleModalOpen,
    handleModalClose,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleSave,
    exportSecteurs,
  };
};
