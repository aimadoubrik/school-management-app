// src/components/CompetencesModal.js
import Modal from '../../../components/shared/Modal';
import ViewCompetence from './ViewCompetence';
import AddCompetence from './AddCompetence';
import PropTypes from 'prop-types';


const CompetencesModal = ({ isOpen, mode, competence, onClose, onSave, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === 'view' ? (
        <ViewCompetence competence={competence} onClose={onClose} onDelete={onDelete} />
      ) : (
        <AddCompetence
          selectedCompetence={competence}  // Pass `selectedCompetence` here
          onClose={onClose}
          onSave={onSave}
          isEditMode={Boolean(competence)}  // Check if competence exists for edit mode
          closeModal={onClose}
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
