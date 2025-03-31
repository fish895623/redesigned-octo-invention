import React, { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import "../../css/Modal.css";
interface CreateMilestoneModalProps {
  projectId: string;
  onClose: () => void;
}

const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({
  projectId,
  onClose,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const { addMilestone } = useProjects();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Milestone title is required");
      return;
    }

    addMilestone(projectId, {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: false,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Milestone</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form className="create-project-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <h3>Milestone Title</h3>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter milestone title"
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
              placeholder="Enter milestone description (optional)"
              rows={4}
            />
          </div>

          <div className="form-field date-fields">
            <div>
              <h3>Start Date (optional)</h3>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <h3>Due Date (optional)</h3>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              onClick={async () => {
                if (!title.trim()) {
                  return; // Don't proceed if title is empty (handled by form submit)
                }
                await fetch(`/api/projects/${projectId}/milestones`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    startDate: startDate || undefined,
                    dueDate: dueDate || undefined,
                    completed: false,
                  }),
                });
              }}
            >
              Create Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMilestoneModal;
