// src/pages/secteurs/components/AddEditsecteur.jsx
import { useState, useEffect } from 'react';
import { Code, BookOpen, Building2, Users, Save, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const AddEditsecteur = ({ secteur, onClose, onSave, isEditMode }) => {
  const [formData, setFormData] = useState({
    id_secteur: '',
    code_secteur: '',
    intitule_secteur: '',
    filieres: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (secteur) {
      setFormData({
        id_secteur: secteur.id_secteur,
        code_secteur: secteur.code_secteur || '',
        intitule_secteur: secteur.intitule_secteur || '',
        secteur: secteur.secteur || '',
        groupes: Array.isArray(secteur.groupes) ? secteur.groupes.join(', ') : '',
      });
    }
  }, [secteur]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code_secteur.trim()) {
      newErrors.code_secteur = 'Le code est requis';
    }
    if (!formData.intitule_secteur.trim()) {
      newErrors.intitule_secteur = "L'intitulé est requis";
    }
    if (!formData.secteur.trim()) {
      newErrors.secteur = 'Le secteur est requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const secteurData = {
        ...formData,
        groupes: formData.groupes
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        // Ensure we keep the id for editing
        secteurData.id = secteur.id;
      }

      await onSave(secteurData);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Une erreur est survenue lors de l'enregistrement",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      id: 'code_secteur',
      label: 'Code secteur',
      icon: <Code />,
      placeholder: 'Entrez le code de la secteur',
    },
    {
      id: 'intitule_secteur',
      label: 'Intitulé secteur',
      icon: <BookOpen />,
      placeholder: "Entrez l'intitulé de la secteur",
    },
    {
      id: 'secteur',
      label: 'Secteur',
      icon: <Building2 />,
      placeholder: 'Entrez le secteur',
    },
    {
      id: 'groupes',
      label: 'Groupes',
      icon: <Users />,
      placeholder: 'Entrez les groupes (séparés par des virgules)',
    },
  ];
  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Modifier la secteur' : 'Ajouter une secteur'}</h2>
      {formFields.map((field) => (
        <div key={field.id} className="form-group">
          <label htmlFor={field.id}>
            {field.icon}
            {field.label}
          </label>
          <input
            type="text"
            id={field.id}
            name={field.id}
            value={formData[field.id]}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
          {errors[field.id] && <span className="error">{errors[field.id]}</span>}
        </div>
      ))}
      {errors.submit && <span className="error">{errors.submit}</span>}
      <div className="form-actions">
        <button type="button" onClick={onClose}>
          Annuler
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isEditMode ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default AddEditsecteur;
