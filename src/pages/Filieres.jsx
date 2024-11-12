import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchfilieres, deleteFiliere, editFiliere } from '../features/filieres/filieresSlice';
import AddFiliere from './addFiliere';
import ViewFiliere from './ViewFiliersDetails';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash2 } from 'lucide-react';

const Filieres = () => {
  const dispatch = useDispatch();
  const { filieres, loading, error } = useSelector((state) => state.filieres);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState(null);

  useEffect(() => {
    dispatch(fetchfilieres());
  }, [dispatch]);

  const openModal = (filiere, mode) => {
    setSelectedFiliere(filiere);
    setViewMode(mode === 'view');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFiliere(null);
    setViewMode(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this filiere?')) {
      dispatch(deleteFiliere(id));
      closeModal();
    }
  };

  const handleSaveEdit = (updatedFiliere) => {
    dispatch(editFiliere(updatedFiliere)).then(() => closeModal());
  };

  const exportFilieres = () => {
    const headers = ['ID', 'Code Filiere', 'Intitule Filiere', 'Secteur'];
    const rows = filieres.map((filiere) => [
      filiere.code_filiere,
      filiere.intitule_filiere,
      filiere.secteur,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    link.download = 'filieres.csv';
    link.click();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={exportFilieres}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Export Filieres (CSV)
        </button>
        <button
          onClick={() => openModal(null, 'edit')}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Ajouter une Filière
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {viewMode ? (
              <ViewFiliere filiere={selectedFiliere} closeModal={closeModal} />
            ) : (
              <AddFiliere
                closeModal={closeModal}
                selectedFiliere={selectedFiliere}
                onSave={handleSaveEdit}
              />
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full bg-white table-auto border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Intitule Filiere</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Secteur</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Groupes</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filieres.map((filiere) => (
              <tr key={filiere.id} className="hover:bg-gray-100">
                <td className="px-6 py-4">{filiere.code_filiere}</td>
                <td className="px-6 py-4">{filiere.intitule_filiere}</td>
                <td className="px-6 py-4">{filiere.secteur}</td>
                <td className="px-6 py-4">
                  <Link to={`/filieres/groupes/${filiere.code_filiere}`}>groupes</Link>
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => openModal(filiere, 'view')}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openModal(filiere, 'edit')}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(filiere.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Filieres;
