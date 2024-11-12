import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addFiliere, editFiliere } from '../features/filieres/filieresSlice';

const AddFiliere = ({ closeModal, selectedFiliere, onSave }) => {
  const dispatch = useDispatch();

  const [codeFiliere, setCodeFiliere] = useState('');
  const [intituleFiliere, setIntituleFiliere] = useState('');
  const [secteur, setSecteur] = useState('');
  const [groupes, setGroupes] = useState('');

  useEffect(() => {
    if (selectedFiliere) {
      setCodeFiliere(selectedFiliere.code_filiere || '');
      setIntituleFiliere(selectedFiliere.intitule_filiere || '');
      setSecteur(selectedFiliere.secteur || '');
      setGroupes(selectedFiliere.groupes.join(', ') || '');
    }
  }, [selectedFiliere]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const filiereData = {
      code_filiere: codeFiliere,
      intitule_filiere: intituleFiliere,
      secteur: secteur,
      groupes: groupes.split(',').map((groupe) => groupe.trim()),
    };

    if (selectedFiliere) {
      dispatch(editFiliere({ ...selectedFiliere, ...filiereData })).then(() => onSave(filiereData));
    } else {
      dispatch(addFiliere(filiereData));
    }

    setCodeFiliere('');
    setIntituleFiliere('');
    setSecteur('');
    setGroupes('');

    closeModal();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        {selectedFiliere ? 'Edit Filière' : 'Add Filière'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Code Filière</label>
          <input
            type="text"
            value={codeFiliere}
            onChange={(e) => setCodeFiliere(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Intitulé Filière</label>
          <input
            type="text"
            value={intituleFiliere}
            onChange={(e) => setIntituleFiliere(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Secteur</label>
          <input
            type="text"
            value={secteur}
            onChange={(e) => setSecteur(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Groupes</label>
          <input
            type="text"
            value={groupes}
            onChange={(e) => setGroupes(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {selectedFiliere ? 'Update Filière' : 'Add Filière'}
        </button>
      </form>
    </div>
  );
};

export default AddFiliere;
