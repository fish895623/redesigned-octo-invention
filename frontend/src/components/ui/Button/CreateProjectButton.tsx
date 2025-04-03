import React, { useState } from 'react';
import CreateProjectModal from '../../modals/CreateProjectModal';

const CreateProjectButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
        onClick={handleOpenModal}
      >
        <span className="mr-1 font-bold">+</span> New Project
      </button>

      {showModal && <CreateProjectModal onClose={handleCloseModal} />}
    </>
  );
};

export default CreateProjectButton;
