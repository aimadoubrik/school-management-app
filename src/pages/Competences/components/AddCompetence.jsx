import { useState, useEffect } from 'react';
import { Code, BookOpen, Users, Save, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const AddCompetence = ({ selectedCompetence, onClose, onSave, isEditMode }) => {
  // Initialize form data state with empty fields
  const [formData, setFormData] = useState({
    code_competence: '',
    intitule_competence: '',
    intitule_module: '',
    cours: '',
    quiz: '',
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  // Submit state to handle disabling buttons during submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to pre-fill form when editing
  useEffect(() => {
    if (selectedCompetence) {
      setFormData({
        id: selectedCompetence.id || '',
        code_competence: selectedCompetence.code_competence || '',
        intitule_competence: Array.isArray(selectedCompetence.intitule_competence)
          ? selectedCompetence.intitule_competence.join(', ')
          : selectedCompetence.intitule_competence || '',
        intitule_module: selectedCompetence.intitule_module || '',
        cours: Array.isArray(selectedCompetence.cours)
          ? selectedCompetence.cours.join(', ')
          : selectedCompetence.cours || '',
        quiz: Array.isArray(selectedCompetence.quiz)
          ? selectedCompetence.quiz.join(', ')
          : selectedCompetence.quiz || '',
      });
    }
  }, [selectedCompetence]);

  // Handle form field changes
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Convert code_competence to string before trimming
    const codeCompetence = String(formData.code_competence || ''); // Ensure it's a string
    if (!codeCompetence.trim()) newErrors.code_competence = 'Code Competence is required';

    const intituleCompetence = formData.intitule_competence || '';
    if (!intituleCompetence.trim())
      newErrors.intitule_competence = 'Intitulé Competence is required';

    const intituleModule = formData.intitule_module || '';
    if (!intituleModule.trim()) newErrors.intitule_module = 'Intitulé Module is required';

    const cours = formData.cours || '';
    if (!cours.trim()) newErrors.cours = 'Cours is required';

    const quiz = formData.quiz || '';
    if (!quiz.trim()) newErrors.quiz = 'Quiz is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
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
          .filter(Boolean), // Convert cours string to array
        quiz: formData.quiz
          .split(',')
          .map((quiz) => quiz.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        // Add ID for editing
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

  // Form fields configuration (including icons and placeholders)
  const formFields = [
    {
      id: 'code_competence',
      label: 'Code Competence',
      icon: <Code className="w-4 h-4" />,
      placeholder: 'Enter the competence code',
    },
    {
      id: 'intitule_competence',
      label: 'Intitulé Competence',
      icon: <BookOpen className="w-4 h-4" />,
      placeholder: 'Enter the competence title',
    },
    {
      id: 'intitule_module',
      label: 'Intitulé Module',
      icon: <BookOpen className="w-4 h-4" />,
      placeholder: 'Enter the module title',
    },
    {
      id: 'cours',
      label: 'Cours',
      icon: <Users className="w-4 h-4" />,
      placeholder: 'Enter the courses (comma separated)',
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: <Users className="w-4 h-4" />,
      placeholder: 'Enter the quizzes (comma separated)',
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        {isEditMode ? <Save className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        {isEditMode ? 'Edit Competence' : 'Add Competence'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.id} className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                {field.icon}
                {field.label}
              </span>
            </label>
            <input
              type="text"
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`input input-bordered w-full ${errors[field.id] ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors[field.id] && (
              <label className="label">
                <span className="label-text-alt text-error">{errors[field.id]}</span>
              </label>
            )}
          </div>
        ))}

        {errors.submit && (
          <div className="alert alert-error">
            <span>{errors.submit}</span>
          </div>
        )}

        <div className="modal-action">
          <button type="button" onClick={onClose} className="btn btn-ghost" disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary gap-2 ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {!isSubmitting &&
              (isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
            {isEditMode ? 'Update' : 'Add'}
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
    code_competence: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Allow both string or number
    intitule_competence: PropTypes.array,
    intitule_module: PropTypes.string,
    cours: PropTypes.array,
    quiz: PropTypes.array,
  }),
};

export default AddCompetence;
