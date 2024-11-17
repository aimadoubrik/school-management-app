// src/components/CompetencesModal.js
import Modal from '../../../components/shared/Modal';
import ViewCompetence from './ViewCompetence';
import AddCompetence from './AddCompetence';
import PropTypes from 'prop-types';
const CompetencesModal = ({ isOpen, mode, competence, onClose, onSave, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === 'view' ? (
        <ViewCompetence competence={competence} closeModal={onClose} />
      ) : (
        <AddCompetence
          selectedCompetence={competence} // Null in 'add' mode
          onClose={onClose}
          onSave={onSave}
          isEditMode={Boolean(competence)} // False in 'add' mode
        />
      )}
    </Modal>
  );
};



CompetencesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['view', 'edit', 'add']).isRequired,
  competence: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func, // Rendre cette propriété facultative
};


export default CompetencesModal;
