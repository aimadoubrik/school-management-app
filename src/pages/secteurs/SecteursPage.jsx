import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchsecteurs } from '../../features/secteur/secteurslice';
import SecteursTable from './components/SecteursTable';
import SecteursHeader from './components/SecteursHeader';
import { useSecteursLogic } from './hooks/useSecteursLogic';

const SecteursPage = () => {
  const dispatch = useDispatch();
  const secteurs = useSelector((state) => state.secteur.secteurs);
  const loading = useSelector((state) => state.secteur.loading);
  const error = useSelector((state) => state.secteur.error);
  const {
    SecteurToDelete,
    isDeleteModalOpen,
    isModalOpen,
    selectedSecteur,
    viewMode,
    handleModalOpen,
    handleModalClose,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleSave,
    handleSearch,
    handleSort,
    sortConfig,
    handleFilterChange,
    exportSecteurs,
  } = useSecteursLogic(secteurs);

  useEffect(() => {
    dispatch(fetchsecteurs());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchsecteurs());
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SecteursHeader
        onRefresh={handleRefresh}
        onExport={exportSecteurs}
        onAdd={() => handleModalOpen(null, 'edit')}
      />
      <SecteursTable
        secteurs={secteurs}
        onSort={handleSort}
        sortConfig={sortConfig}
        onView={(secteur) => handleModalOpen(secteur, 'view')}
        onEdit={(secteur) => handleModalOpen(secteur, 'edit')}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};

export default SecteursPage;
