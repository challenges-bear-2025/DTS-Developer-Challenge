/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "../../components/TaskForm"; // Adjust the import based on where your component is located
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Create an axios mock adapter instance
const mock = new MockAdapter(axios);

describe("TaskForm Component", () => {
  beforeEach(() => {
    // Reset the mock adapter before each test to prevent interference
    mock.reset();
  });

  test("renders the form with default values", () => {
    render(<TaskForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Day/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
  });

  test("displays validation errors when the form is submitted with empty fields", async () => {
    render(<TaskForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/enter your due date/i)).toBeInTheDocument();
    });
  });

  test("displays validation error for invalid date input", async () => {
    render(<TaskForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/Task Description/i), {
      target: { value: "32" },
    }); 
    fireEvent.change(screen.getByLabelText(/Month/i), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText(/Year/i), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });

    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(screen.getByTestId('due-date-error')).toHaveTextContent(/Error: Enter your due date/i);
    });
  });

  test("submits the form successfully when valid inputs are provided", async () => {
    const handleSubmit = jest.fn();
    render(<TaskForm onSubmit={handleSubmit} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/Task Description/i), {
      target: { value: "Task description" },
    });
    fireEvent.change(screen.getByLabelText(/Day/i), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByLabelText(/Month/i), {
      target: { value: "05" },
    });
    fireEvent.change(screen.getByLabelText(/Year/i), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });

    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        title: "New Task",
        description: "Task description",
        status: "Pending",
        dueDate: expect.any(String),
      });
    });
  });

  test("calls onSubmit with correct task data when form is submitted", async () => {
    const handleSubmit = jest.fn();

    render(<TaskForm onSubmit={handleSubmit} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/Task Description/i), {
      target: { value: "Task description" },
    });
    fireEvent.change(screen.getByLabelText(/Day/i), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByLabelText(/Month/i), {
      target: { value: "05" },
    });
    fireEvent.change(screen.getByLabelText(/Year/i), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:00" },
    });

    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      const submittedTask = handleSubmit.mock.calls[0][0]; // first argument of first call
      expect(submittedTask.title).toBe("New Task");
      expect(submittedTask.description).toBe("Task description");
      expect(submittedTask.status).toBe("Pending");
      expect(submittedTask.dueDate).toContain("2025-05-15T11:00:00.000Z"); // Due date contains correct date/time
    });
  });
});
