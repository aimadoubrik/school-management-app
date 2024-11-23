import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStagiaires,
  selectStagiaires,
  setFiliereFilter,
  setGroupeFilter,
  addStagiaire,
  deleteStagiaire,
  updateStagiaire,
} from '../../features/Stagiaire/stagiaireSlice';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Plus, Edit, Trash2 } from 'lucide-react';

Modal.setAppElement('#root');

const Stagiaire = () => {
  const dispatch = useDispatch();
  const stagiaires = useSelector(selectStagiaires);
  const loading = useSelector((state) => state.stagiaires.status === 'loading');
  const error = useSelector((state) => state.stagiaires.error);

  const [filiereFilter, setFiliereFilterState] = useState('');
  const [groupeFilter, setGroupeFilterState] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStagiaire, setModalStagiaire] = useState({
    cef: '',
    nom: '',
    prenom: '',
    email: '',
    filiere: '',
    groupe: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchStagiaires());
  }, [dispatch]);

  const filiereOptions = [...new Set(stagiaires.map((stagiaire) => stagiaire.filiere))];

  const handleFiliereChange = (e) => {
    const selectedFiliere = e.target.value;
    setFiliereFilterState(selectedFiliere);
    setGroupeFilterState('');
    dispatch(setFiliereFilter(selectedFiliere));
  };

  const handleGroupeChange = (e) => {
    const selectedGroupe = e.target.value;
    setGroupeFilterState(selectedGroupe);
    dispatch(setGroupeFilter(selectedGroupe));
  };

  const handleAddStagiaire = () => {
    if (modalStagiaire.cef) {
      dispatch(updateStagiaire(modalStagiaire));
    } else {
      dispatch(addStagiaire(modalStagiaire));
    }
    setIsModalOpen(false);
    setModalStagiaire({ cef: '', nom: '', prenom: '', email: '', filiere: '', groupe: '' });
  };

  const handleDeleteStagiaire = (cef) => {
    dispatch(deleteStagiaire(cef));
  };

  const handleUpdateStagiaire = (cef) => {
    const stagiaireToUpdate = stagiaires.find((stagiaire) => stagiaire.cef === cef);
    setModalStagiaire(stagiaireToUpdate);
    setIsModalOpen(true);
  };

  const filteredStagiaires = stagiaires.filter((stagiaire) => {
    const isFiliereMatch = filiereFilter ? stagiaire.filiere === filiereFilter : true;
    const isGroupeMatch = groupeFilter ? stagiaire.groupe === groupeFilter : true;
    const isSearchMatch = searchTerm ? stagiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) || stagiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return isFiliereMatch && isGroupeMatch && isSearchMatch;
  });

  const displayedStagiaires = filteredStagiaires.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredStagiaires.length / itemsPerPage);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStagiaires);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stagiaires');
    XLSX.writeFile(wb, 'stagiaires.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Liste des Stagiaires', 10, 10);
    displayedStagiaires.forEach((stagiaire, index) => {
      doc.text(
        `CEF: ${stagiaire.cef}, Nom: ${stagiaire.nom}, Prénom: ${stagiaire.prenom}, Email: ${stagiaire.email}, Filière: ${stagiaire.filiere}, Groupe: ${stagiaire.groupe}`,
        10,
        20 + (index * 10)
      );
    });
    doc.save('stagiaires.pdf');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalStagiaire({ cef: '', nom: '', prenom: '', email: '', filiere: '', groupe: '' });
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="max-w-7xl  p-2 space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary"><Plus size={16} /> Ajouter Stagiaire</button>
        <div className="flex space-x-4">
          <input type="text" placeholder="Rechercher" className="input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select onChange={handleFiliereChange} value={filiereFilter} className="input">
            <option value="">Filière</option>
            {filiereOptions.map((filiere) => (
              <option key={filiere} value={filiere}>{filiere}</option>
            ))}
          </select>
          <select onChange={handleGroupeChange} value={groupeFilter} className="input">
            <option value="">Groupe</option>
            <option value="G101">G101</option>
            <option value="G102">G102</option>
          </select>
        </div>
        <div className="space-x-2">
          <button onClick={exportToExcel} className="btn btn-outline">Exporter en Excel</button>
          <button onClick={exportToPDF} className="btn btn-outline">Exporter en PDF</button>
        </div>
      </div>

      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">CEF</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Prénom</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Filière</th>
            <th className="px-4 py-2">Groupe</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedStagiaires.map((stagiaire) => (
            <tr key={stagiaire.cef}>
              <td className="px-4 py-2">{stagiaire.cef}</td>
              <td className="px-4 py-2">{stagiaire.nom}</td>
              <td className="px-4 py-2">{stagiaire.prenom}</td>
              <td className="px-4 py-2">{stagiaire.email}</td>
              <td className="px-4 py-2">{stagiaire.filiere}</td>
              <td className="px-4 py-2">{stagiaire.groupe}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleUpdateStagiaire(stagiaire.cef)} className="btn btn-warning"><Edit size={16} /></button>
                <button onClick={() => handleDeleteStagiaire(stagiaire.cef)} className="btn btn-danger"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button onClick={goToPreviousPage} disabled={currentPage === 1} className="btn btn-outline">Précédent</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="btn btn-outline">Suivant</button>
      </div>

      {/* Modal pour ajouter/modifier un stagiaire */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-1 space-y-1 relative mt-12"
      >
        <div className="modal-header">
          <h2 className="text-lg font-semibold">{modalStagiaire.cef ? 'Modifier' : 'Ajouter'} un Stagiaire</h2>
          <button onClick={handleCancel} className="close-button">
            ×
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">CEF</label>
              <input
                type="text"
                value={modalStagiaire.cef}
                onChange={(e) => setModalStagiaire({ ...modalStagiaire, cef: e.target.value })}
                className="w-full px-4 py-1 border rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={modalStagiaire.nom}
                onChange={(e) => setModalStagiaire({ ...modalStagiaire, nom: e.target.value })}
                className="w-full px-4 py-1 border rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={modalStagiaire.prenom}
                onChange={(e) => setModalStagiaire({ ...modalStagiaire, prenom: e.target.value })}
                className="w-full px-4 py-1 border rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={modalStagiaire.email}
                onChange={(e) => setModalStagiaire({ ...modalStagiaire, email: e.target.value })}
                className="w-full px-4 py-1 border rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Filière</label>
              <input
                type="text"
                value={modalStagiaire.filiere}
                onChange={(e) => setModalStagiaire({ ...modalStagiaire, filiere: e.target.value })}
                className="w-full px-4 py-1 border rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Groupe</label>
              <input
                type="text"
                value={modalStagiaire.groupe}
                onChange={(e) => setModalStagiaire({ ...modalStagiaire, groupe: e.target.value })}
                className="w-full px-4 py-1 border rounded-md"
              />
            </div>
          </form>
        </div>
        <div className="modal-footer flex justify-between">
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleAddStagiaire}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            {modalStagiaire.cef ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Stagiaire;
