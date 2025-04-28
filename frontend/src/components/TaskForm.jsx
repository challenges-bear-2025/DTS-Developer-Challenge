import { useState } from "react";
import { formatDate, validateDate } from "../lib/utils";

export default function TaskForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status] = useState("Pending");
  const [dueDateDay, setDueDateDay] = useState("");
  const [dueDateMonth, setDueDateMonth] = useState("");
  const [dueDateYear, setDueDateYear] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Title Validation
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    // Date and Time Validation
    let combinedDueDate;
    const currentDate = new Date();

    if (!dueDateDay || !dueDateMonth || !dueDateYear) {
      newErrors.dueDate = "Enter your due date";
      if (!dueDateDay) newErrors.dueDateDay = "Due date must include a day";
      if (!dueDateMonth)
        newErrors.dueDateMonth = "Due date must include a month";
      if (!dueDateYear) newErrors.dueDateYear = "Due date must include a year";
    } else {
      const formattedDate = `${dueDateYear}-${dueDateMonth.padStart(
        2,
        "0"
      )}-${dueDateDay.padStart(2, "0")}`;
      combinedDueDate = new Date(`${formattedDate}T${dueTime}:00`);

      // Check for real date
      if (isNaN(combinedDueDate.getTime())) {
        newErrors.dueDate = "Due date must be a real date";
      }
      if (
        dueDateDay &&
        dueDateMonth &&
        dueDateYear &&
        !validateDate(dueDateDay, dueDateMonth, dueDateYear)
      ) {
        newErrors.dueDate = "Due date must be a real date";
      }

      // Check if date is in the past when it must be in the future
      if (combinedDueDate < currentDate) {
        newErrors.dueDate = "Due date must be in the future";
      }

      // Check if time is entered and valid
      if (!dueTime || !/^\d{2}:\d{2}$/.test(dueTime)) {
        newErrors.dueTime = "Enter a valid time in the format HH:MM";
      }
    }

    // Check if time is in the future
    if (dueTime && combinedDueDate && combinedDueDate.getHours() > 23) {
      newErrors.dueTime = "Time must be in the valid 24-hour format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form is invalid");
      return;
    }

    const dueDateFormatted = formatDate(dueDateDay, dueDateMonth, dueDateYear);
    const combinedDueDate = new Date(`${dueDateFormatted}T${dueTime}:00`);

    const newTask = {
      title,
      description,
      status,
      dueDate: combinedDueDate.toISOString(),
    };

    onSubmit(newTask);
  };

  return (
    <form
      id="task-form"
      data-testid="form"
      className="govuk-form task-form"
      onSubmit={handleSubmit}
    >
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading">Add New Task</h1>
        </legend>

        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="task-title">
            Task Title <span className="task-form-required">*</span>
          </label>
          <input
            className="govuk-input"
            id="task-title"
            name="taskTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="task-title"
          />
          {errors.title && (
            <span className="govuk-error-message">{errors.title}</span>
          )}
        </div>

        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="task-description">
            Task Description 
          </label>
          <input
            className="govuk-input"
            id="task-description"
            name="taskDescription"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="task-description"
          />
        </div>

        <div
          className={`govuk-form-group ${
            errors.dueDate ? "govuk-form-group--error" : ""
          }`}
        >
          <fieldset
            className="govuk-fieldset"
            role="group"
            aria-describedby="due-date-hint due-date-error"
          >
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h3 className="govuk-fieldset__heading">When is the task due? <span className="task-form-required">*</span></h3>
            </legend>

            {errors.dueDate && (
              <p id="due-date-error" data-testid="due-date-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span>{" "}
                {errors.dueDate}
              </p>
            )}

            {errors.dueTime && (
              <p id="due-date-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span>{" "}
                {errors.dueTime}
              </p>
            )}

            <div className="govuk-date-input" id="task-due-date">
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="task-due-day"
                  >
                    Day
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.dueDate ? "govuk-input--error" : ""
                    }`}
                    id="task-due-day"
                    name="task-due-day"
                    type="text"
                    value={dueDateDay}
                    onChange={(e) => setDueDateDay(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="task-due-month"
                  >
                    Month
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.dueDate ? "govuk-input--error" : ""
                    }`}
                    id="task-due-month"
                    name="task-due-month"
                    type="text"
                    value={dueDateMonth}
                    onChange={(e) => setDueDateMonth(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="task-due-year"
                  >
                    Year
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-4 ${
                      errors.dueDate ? "govuk-input--error" : ""
                    }`}
                    id="task-due-year"
                    name="task-due-year"
                    type="text"
                    value={dueDateYear}
                    onChange={(e) => setDueDateYear(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label className="govuk-label" htmlFor="task-due-time">
                    Time
                  </label>
                  <input
                    className={`govuk-input ${
                      errors.dueDate ? "govuk-input--error" : ""
                    }`}
                    id="task-due-time"
                    name="task-due-time"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="govuk-button-group">
          <button
            type="submit"
            className="govuk-button"
            data-module="govuk-button"
          >
            Create Task
          </button>
        </div>
      </fieldset>
    </form>
  );
}
