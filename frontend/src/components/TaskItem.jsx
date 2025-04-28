/**
 * TaskItem component represents an individual task in a task list.
 * It allows users to view task details, change status, and delete the task.
 * It also displays information such as the task's due date and status.
 */

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
  // expanded controls whether the task details section is visible or not
  const [expanded, setExpanded] = useState(false);
  // showDeleteDialog controls whether the delete confirmation modal is visible
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // showDeleteButton controls whether the delete button is visible
  const [showDeleteButton, SetShowDeleteButton] = useState(true);

  /**
   * Handles changes to the task status.
   * This function updates the status of the task and triggers the onUpdate callback.
   *
   * @param {string} newStatus - The new status to set for the task (e.g., "Completed", "InProgress")
   */
  const handleStatusChange = (newStatus) => {
    onUpdate({
      ...task,
      status: newStatus,
    });
  };

  /**
   * Handles task deletion after confirmation.
   * It triggers the onDelete callback with the task ID and resets the delete-related states.
   */
  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
    SetShowDeleteButton(true);
  };

  /**
   * Cancels the delete action and hides the confirmation modal.
   */
  const handleCancel = () => {
    setShowDeleteDialog(false);
    SetShowDeleteButton(true);
  };

  /**
   * Returns the appropriate icon for the task based on its status.
   *
   * @returns {JSX.Element} - Icon representing the current status of the task.
   */
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

  /**
   * Returns the appropriate status tag for the task.
   * Displays a colored tag indicating the task's status.
   *
   * @returns {JSX.Element} - Status tag element
   */
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

  /**
   * Checks if the task is past due based on the current date and the task's due date.
   * A task is considered past due if its due date is in the past and its status is not "Completed".
   *
   * @returns {boolean} - true if the task is overdue, otherwise false.
   */
  const isPastDue = () => {
    const currentDate = new Date();
    const dueDateFormatted = formatDateTimeZone(task.dueDate, "Europe/London");
    const dueDate = new Date(dueDateFormatted);
    return dueDate < currentDate && task.status !== "Completed";
  };

  return (
    <div className={`task-item`}>
      {/* Task header that toggles the details section on click */}
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
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </div>

      {/* Task details section */}
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
