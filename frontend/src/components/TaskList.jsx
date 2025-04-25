import { useEffect, useState } from "react";
import { fetchTasks } from "../api/mockTasksApi";
//import { fetchTasks } from "../api/taskApi";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadTasks = async () => {
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

    loadTasks();
  }, []);

  const handleUpdateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.ID === updatedTask.ID ? updatedTask : task))
    );
  };

  const handleDeleteTask = (taskID) => {
    setTasks(tasks.filter((task) => task.ID !== taskID));
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
      <div class="govuk-error-summary" data-module="govuk-error-summary">
        <div role="alert">
          <h2 class="govuk-error-summary__title">
            There was an error retrieving your task list
          </h2>
          <div class="govuk-error-summary__body">
            <p>
              Please try again. If the problem persists please contact GOV.UK
              support
            </p>
            <button
              type="button"
              class="govuk-button"
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
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <p className="govuk-body-l"> {tasks.length} tasks found</p>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <div class="govuk-form-group">
                <select
                  class="govuk-select"
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
                type="submit"
                class="govuk-button"
                data-module="govuk-button"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Cancel" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div>
          <div class="govuk-warning-text">
            <span class="govuk-warning-text__icon" aria-hidden="true">
              !
            </span>
            <strong class="govuk-warning-text__text">
              <span class="govuk-visually-hidden">Warning</span>
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
              key={task.ID}
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
