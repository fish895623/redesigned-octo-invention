import React, { useState } from "react";
import CreateProjectModal from "./modal/CreateProjectModal";

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
      <button className="create-project-button" onClick={handleOpenModal}>
        <span className="plus-icon">+</span> New Project
      </button>

      {showModal && <CreateProjectModal onClose={handleCloseModal} />}
    </>
  );
};

export default CreateProjectButton;
