import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteFiliere } from '../features/filieres/filieresSlice';

const ViewFiliere = ({ filiere, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this filiere?')) {
      dispatch(deleteFiliere(filiere.id));
      closeModal();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filière Details</h2>
      <div className="space-y-4">
        <div>
          <strong className="text-lg text-gray-700">Intitulé Filière: </strong>
          <p className="text-lg text-gray-600">{filiere.intitule_filiere}</p>
        </div>
        <div>
          <strong className="text-lg text-gray-700">Code Filière: </strong>
          <p className="text-lg text-gray-600">{filiere.code_filiere}</p>
        </div>
        <div>
          <strong className="text-lg text-gray-700">Secteur: </strong>
          <p className="text-lg text-gray-600">{filiere.secteur}</p>
        </div>
        <div>
          <strong className="text-lg text-gray-700">Groupes: </strong>
          <p className="text-lg text-gray-600">{filiere.groupes?.join(', ')}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={closeModal}
          className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md"
        >
          Close
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ViewFiliere;
