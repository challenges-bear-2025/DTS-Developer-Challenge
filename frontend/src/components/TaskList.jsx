/**
 * TaskList component that manages the task list, task creation, and task filtering.
 *
 * This component fetches tasks from an API, allows filtering tasks by their status, and
 * enables users to create, update, or delete tasks.
 */

import { useEffect, useState } from "react";
import {
  createTask,
  fetchTasks,
  fetchTaskByID,
  updateTaskByID,
  deleteTaskByID,
} from "../api/taskApi.js";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

export default function TaskList() {
  // State to store list of tasks
  const [tasks, setTasks] = useState([]);
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);
  // State to control visibility of the task form
  const [showForm, setShowForm] = useState(false);
  // State to filter tasks by their status (e.g., "All", "Pending", etc.)
  const [statusFilter, setStatusFilter] = useState("All");

  /**
   * Effect hook to fetch tasks from the API when the component is mounted.
   * The tasks are fetched once and stored in the state.
   */
  useEffect(() => {
    refreshTaskList();
  }, []);

  /**
   * Fetches tasks from the API and updates the task list state.
   * Handles errors during the fetch operation.
   */
  const refreshTaskList = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the creation of a new task.
   * Sends the task data to the API and updates the task list state.
   *
   * @param {Object} newTask - The task data to create.
   */
  const handleCreateTask = async (newTask) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  /**
   * Handles updating a task's status.
   * Sends updated task data to the API and updates the task list in state.
   *
   * @param {Object} updatedTask - The task with updated information.
   */
  const handleUpdateTask = async (updatedTask) => {
    try {
      const taskId = updatedTask.id;
      const task = await fetchTaskByID(taskId);
      if (!task) {
        console.error("Task not found");
        return;
      }

      const updatedTaskFromBackend = await updateTaskByID(updatedTask.id, {
        status: updatedTask.status,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTaskFromBackend.id
            ? { ...task, status: updatedTaskFromBackend.status }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  /**
   * Handles the deletion of a task.
   * Sends the task ID to the API to delete the task and updates the task list state.
   *
   * @param {number} taskID - The ID of the task to delete.
   */
  const handleDeleteTask = async (taskID) => {
    try {
      if (taskID === undefined || taskID === null) {
        console.error("Invalid task ID:", taskID);
        return;
      }
      await deleteTaskByID(taskID);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskID));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  /**
   * Filters the tasks based on the selected status filter.
   *
   * @returns {Array} - The filtered tasks based on the selected filter.
   */
  const filteredTasks =
    statusFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  /**
   * Displays a loading message while tasks are being fetched.
   *
   * @returns {JSX.Element} - The loading indicator element.
   */
  if (isLoading) {
    return <div className="govuk-body-l">Loading tasks...</div>;
  }

  /**
   * Displays an error message if the tasks failed to load.
   *
   * @returns {JSX.Element} - The error message element.
   */
  if (error) {
    return (
      <div className="govuk-error-summary" data-module="govuk-error-summary">
        <div role="alert">
          <h2 className="govuk-error-summary__title">
            There was an error retrieving your task list
          </h2>
          <div className="govuk-error-summary__body">
            <p>
              Please try again. If the problem persists please contact GOV.UK
              support
            </p>
            <button
              type="button"
              className="govuk-button"
              data-module="govuk-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Task filter and create button */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <p className="govuk-body-l"> {tasks.length} tasks found</p>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <div className="govuk-form-group">
                <select
                  className="govuk-select"
                  id="filter"
                  name="filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="govuk-grid-column-one-half">
              <button
                type="button"
                className="govuk-button"
                data-module="govuk-button"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Cancel" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Task creation form, shown if showForm is true */}
      {showForm && (
        <div>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
      {/* Displaying task list or error/warning messages */}
      {filteredTasks.length === 0 && tasks.length === 0 ? (
        <div>
          <div className="govuk-warning-text">
            <span className="govuk-warning-text__icon" aria-hidden="true">
              !
            </span>
            <strong className="govuk-warning-text__text">
              <span className="govuk-visually-hidden">Warning</span>
              Your task list is currently empty. Try creating a new task.
            </strong>
          </div>
          <p className="govuk-body-s">
            Click the button above to add your first task.
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div>
          <div className="govuk-warning-text">
            <span className="govuk-warning-text__icon" aria-hidden="true">
              !
            </span>
            <strong className="govuk-warning-text__text">
              <span className="govuk-visually-hidden">Warning</span>
              No tasks could be found for the current filter.
            </strong>
          </div>
          {statusFilter !== "All" && (
            <p className="govuk-body-s">
              Try changing your filter or adding a new task.
            </p>
          )}
        </div>
      ) : (
        <div>
          {/* Display filtered tasks */}
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
