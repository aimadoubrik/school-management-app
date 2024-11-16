import PropTypes from 'prop-types';

function Modal({ isOpen,children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 max-h-[500px] overflow-y-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}


Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,       
  children: PropTypes.node.isRequired,    
};

export default Modal;
