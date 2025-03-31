import React, { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import "../../css/Modal.css";
import { Project } from "../../types/project";
interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  onClose,
}) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");
  const [titleError, setTitleError] = useState("");
  const { updateProject } = useProjects();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Project title is required");
      return;
    }

    const updatedProject = {
      ...project,
      title: title.trim(),
      description: description.trim() || undefined,
      updatedAt: new Date(),
    };

    updateProject(updatedProject);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Project</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form className="edit-project-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <h3>Project Title</h3>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter project title"
              autoFocus
              className={titleError ? "input-error" : ""}
            />
            {titleError && <div className="error-tooltip">{titleError}</div>}
          </div>

          <div className="form-field">
            <h3>Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description (optional)"
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
