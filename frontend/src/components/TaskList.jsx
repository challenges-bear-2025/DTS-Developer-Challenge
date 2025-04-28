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
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    refreshTaskList();
  }, []);

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

  const handleCreateTask = async (newTask) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

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

  const filteredTasks =
    statusFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  if (isLoading) {
    return <div className="govuk-body-l">Loading tasks...</div>;
  }

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
      {showForm && (
        <div>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
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
