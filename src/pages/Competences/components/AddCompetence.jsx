import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Code, BookOpen, Users, Save, Plus, Building2 } from 'lucide-react';
import PropTypes from 'prop-types';

const AddCompetence = ({ selectedCompetence, onClose, onSave, isEditMode }) => {
  const { competences } = useSelector((state) => state.competences);

  // Extract unique filieres from competences
  const filieres = [...new Set(competences.map((competence) => competence.filiere))];

  const [formData, setFormData] = useState({
    code_competence: '',
    intitule_competence: '',
    intitule_module: '',
    filiere: '',
    cours: '',
    quiz: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCompetence) {
      setFormData({
        id: selectedCompetence.id || '',
        code_competence: selectedCompetence.code_competence || '',
        intitule_competence: Array.isArray(selectedCompetence.intitule_competence)
          ? selectedCompetence.intitule_competence.join(', ')
          : selectedCompetence.intitule_competence || '',
        intitule_module: selectedCompetence.intitule_module || '',
        filiere: selectedCompetence.filiere || '',
        cours: Array.isArray(selectedCompetence.cours)
          ? selectedCompetence.cours.join(', ')
          : selectedCompetence.cours || '',
        quiz: Array.isArray(selectedCompetence.quiz)
          ? selectedCompetence.quiz.join(', ')
          : selectedCompetence.quiz || '',
      });
    }
  }, [selectedCompetence]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!String(formData.code_competence).trim()) newErrors.code_competence = 'Code Competence is required';
    if (!formData.intitule_competence.trim()) newErrors.intitule_competence = 'Intitulé Competence is required';
    if (!formData.intitule_module.trim()) newErrors.intitule_module = 'Intitulé Module is required';
    if (!formData.filiere.trim()) newErrors.filiere = 'Filière is required';
    if (!formData.cours.trim()) newErrors.cours = 'Cours is required';
    if (!formData.quiz.trim()) newErrors.quiz = 'Quiz is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const competenceData = {
        ...formData,
        intitule_competence: formData.intitule_competence
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        cours: formData.cours
          .split(',')
          .map((cour) => cour.trim())
          .filter(Boolean),
        quiz: formData.quiz
          .split(',')
          .map((quiz) => quiz.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        competenceData.id = selectedCompetence.id;
      }

      await onSave(competenceData);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || 'An error occurred during saving.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        {isEditMode ? <Save className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        {isEditMode ? 'Edit Competence' : 'Add Competence'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Code Competence', icon: <Code />, name: 'code_competence' },
          { label: 'Intitulé Competence', icon: <Users />, name: 'intitule_competence' },
          { label: 'Intitulé Module', icon: <BookOpen />, name: 'intitule_module' },
          { label: 'Cours', icon: <BookOpen />, name: 'cours' },
          { label: 'Quiz', icon: <BookOpen />, name: 'quiz' },
        ].map(({ label, icon, name }) => (
          <div key={name} className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                {icon} {label}
              </span>
            </label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={`Enter the ${label.toLowerCase()}`}
              className={`input input-bordered w-full ${errors[name] ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors[name] && (
              <label className="label">
                <span className="label-text-alt text-error">{errors[name]}</span>
              </label>
            )}
          </div>
        ))}

        {/* Filière Select */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Filière
            </span>
          </label>
          <select
            name="filiere"
            value={formData.filiere}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.filiere ? 'input-error' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select Filière</option>
            {filieres.map((filiere, index) => (
              <option key={index} value={filiere}>
                {filiere}
              </option>
            ))}
          </select>
          {errors.filiere && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.filiere}</span>
            </label>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="btn btn-ghost" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Competence'}
          </button>
        </div>
      </form>
    </div>
  );
};

AddCompetence.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCompetence: PropTypes.shape({
    id: PropTypes.string,
    code_competence: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    intitule_competence: PropTypes.array,
    intitule_module: PropTypes.string,
    filiere: PropTypes.string,
    cours: PropTypes.array,
    quiz: PropTypes.array,
  }),
  isEditMode: PropTypes.bool.isRequired,
};

export default AddCompetence;
