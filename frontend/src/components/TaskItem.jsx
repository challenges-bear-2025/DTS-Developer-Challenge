import { useState } from "react";
import { formatDateTimeZone } from "../lib/utils";
import DeleteConfirmationModal from "./modal/DeleteConfirmationModal";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteButton, SetShowDeleteButton] = useState(true);

  const handleStatusChange = (newStatus) => {
    onUpdate({
      ...task,
      status: newStatus,
    });
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
    SetShowDeleteButton(true);
  };

  const handleCancel = () => {
    setShowDeleteDialog(false);
    SetShowDeleteButton(true);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "Completed":
        return <CheckCircleIcon className="task-item-icon--completed" />;
      case "InProgress":
        return <ClockIcon className="task-item-icon--in-progress" />;
      default:
        return <AlertCircleIcon className="" />;
    }
  };

  const getStatusTag = () => {
    switch (task.status) {
      case "Completed":
        return <span className="govuk-tag govuk-tag--green">Completed</span>;
      case "InProgress":
        return <span className="govuk-tag govuk-tag--blue">In Progress</span>;
      case "Pending":
        return <span className="govuk-tag govuk-tag--grey">Pending</span>;
      default:
        return <span className="govuk-tag govuk-tag--grey">Pending</span>;
    }
  };

  const isPastDue = () => {
    const currentDate = new Date();
    const dueDateFormatted = formatDateTimeZone(task.dueDate, "Europe/London");
    const dueDate = new Date(dueDateFormatted);
    return dueDate < currentDate && task.status !== "Completed";
  };

  return (
    <div className={`task-item`}>
      <div
        className={`task-item-header ${
          isPastDue() ? "task-item-header--overdue" : ""
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="govuk-!-margin-right-3 task-item-icon">
          {getStatusIcon()}
        </div>
        <div className="task-item-title">
          <h3 className="govuk-heading-m">{task.title}</h3>
          <div className="task-item-meta">
            {getStatusTag()}
            <span
              className={`task-item-meta--due${
                isPastDue() ? " task-item-meta--due--overdue" : ""
              }`}
            >
              Due: {formatDateTimeZone(task.dueDate, "Europe/London")}
              {isPastDue() && " (Overdue)"}
            </span>
          </div>
        </div>
        <div className="task-item-actions">
          {expanded ? (
            <ChevronUpIcon />
          ) : (
            <ChevronDownIcon />
          )}
        </div>
      </div>

      {expanded && (
        <div className="task-item-details">
          <div className="task-item-details--left">
            {showDeleteDialog && (
              <DeleteConfirmationModal
                onConfirm={handleDelete}
                onCancel={handleCancel}
              />
            )}
            <div className="task-item-details-section">
              <h4 className="govuk-heading-s">Description</h4>
              <p className="govuk-body-s">
                {task.description || "No description provided."}
              </p>
            </div>
            <div className="task-item-details-section">
              <h4 className="govuk-heading-s">Change Status</h4>
              <div className="govuk-button-group">
                <button
                  type="button"
                  onClick={() => handleStatusChange("Pending")}
                  className={`govuk-button govuk-button--secondary ${
                    task.status === "Pending" ? "task-button--active" : ""
                  }`}
                  data-module="govuk-button"
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("InProgress")}
                  className={`govuk-button govuk-button--secondary ${
                    task.status === "InProgress" ? "task-button--active" : ""
                  }`}
                  data-module="govuk-button"
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Completed")}
                  className={`govuk-button govuk-button--secondary ${
                    task.status === "Completed" ? "task-button--active" : ""
                  }`}
                  data-module="govuk-button"
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
          <div className="task-item-details--right">
            {showDeleteButton && (
              <button
                type="button"
                className="govuk-button govuk-button--warning"
                data-module="govuk-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                  SetShowDeleteButton(false);
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
