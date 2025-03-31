import React, { useState, useEffect } from "react";
import { useProjects } from "../../hooks/useProjects";
import { Milestone } from "../../types/project";
import "../../css/Modal.css";

interface CreateTaskModalProps {
  projectId: string;
  milestones: Milestone[];
  onClose: () => void;
  selectedMilestoneId?: string | null;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  projectId,
  milestones,
  onClose,
  selectedMilestoneId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneId, setMilestoneId] = useState<string | undefined>(undefined);
  const [titleError, setTitleError] = useState("");
  const { addTask } = useProjects();

  // Set the milestone ID when the modal opens with a selected milestone
  useEffect(() => {
    if (selectedMilestoneId) {
      setMilestoneId(selectedMilestoneId);
    }
  }, [selectedMilestoneId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Task title is required");
      return;
    }

    addTask(projectId, {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      milestoneId: milestoneId,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form className="create-task-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <h3>Task Title</h3>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter task title"
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
              placeholder="Enter task description (optional)"
              rows={4}
            />
          </div>

          <div className="form-field">
            <h3>Milestone</h3>
            <select
              value={milestoneId || ""}
              onChange={(e) => setMilestoneId(e.target.value || undefined)}
            >
              <option value="">No Milestone</option>
              {milestones.map((milestone) => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.title}
                </option>
              ))}
            </select>
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
                await fetch(`/api/projects/${projectId}/tasks`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    milestoneId: milestoneId,
                    completed: false,
                  }),
                });
              }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
