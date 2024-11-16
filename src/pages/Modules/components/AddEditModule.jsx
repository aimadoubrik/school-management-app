import React from 'react';

function AddEditModule({ formData, handleChange, handleSubmit, handleModalClose, editingModuleId }) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {editingModuleId ? 'Edit Module' : 'Add New Module'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        {['code', 'intitule', 'masseHoraire', 'filiere', 'competences', 'formateur'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'masseHoraire' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required={field !== 'filiere' && field !== 'formateur'}
            />
          </div>
        ))}

        {/* Dropdowns */}
        {['secteur', 'niveau'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <select
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required>
              {field === 'secteur' ? (
                <>
                  <option value="Digital">Digital</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                </>
              ) : (
                <>
                  <option value="1A">1ère année</option>
                  <option value="2A">2ème année</option>
                </>
              )}
            </select>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={handleModalClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">
            {editingModuleId ? 'Save Changes' : 'Save Module'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditModule;
