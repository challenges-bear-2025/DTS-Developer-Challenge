/* eslint-disable testing-library/no-node-access */
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskManager from "../../views/TaskManager";
import "@testing-library/jest-dom";
import {
  createTask,
  fetchTasks,
  updateTaskByID,
  deleteTaskByID,
} from "../../api/taskApi";

jest.mock("../../api/taskApi");

const mockTasks = [
  {
    id: 1,
    title: "Existing Task 1",
    description: "This is the first task",
    dueDate: "2025-05-01T16:00:00",
    status: "Pending",
  },
  {
    id: 2,
    title: "Existing Task 2",
    description: "This is the second task",
    dueDate: "2025-06-01T12:00:00",
    status: "Completed",
  },
];

describe("Task Manager Functional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fetchTasks.mockResolvedValue(mockTasks);
    createTask.mockImplementation((task) =>
      Promise.resolve({ id: Math.floor(Math.random() * 1000) + 3, ...task })
    );
    updateTaskByID.mockImplementation((id, updates) =>
      Promise.resolve({ id, ...updates })
    );
    deleteTaskByID.mockResolvedValue(undefined);
  });

  async function createTestTask(
    user,
    { title, description, day, month, year, time }
  ) {
    await user.click(screen.getByRole("button", { name: /Create Task/i }));

    await user.type(screen.getByLabelText(/Task Title/i), title);

    if (description) {
      await user.type(screen.getByLabelText(/Task Description/i), description);
    }

    await user.clear(screen.getByLabelText(/Day/i));
    await user.type(screen.getByLabelText(/Day/i), day);

    await user.clear(screen.getByLabelText(/Month/i));
    await user.type(screen.getByLabelText(/Month/i), month);

    await user.clear(screen.getByLabelText(/Year/i));
    await user.type(screen.getByLabelText(/Year/i), year);

    await user.clear(screen.getByLabelText(/Time/i));
    await user.type(screen.getByLabelText(/Time/i), time);

    const submitButton = screen.getByText("Create Task");
    await user.click(submitButton);
  }

  describe("FR1: Task Creation", () => {
    it("allows user to create a new task with all fields filled", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
      });

      const newTask = {
        title: "My Test Task",
        description: "This is a test description",
        day: "31",
        month: "12",
        year: "2025",
        time: "23:59",
      };

      await createTestTask(user, newTask);

      expect(createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: newTask.title,
          description: newTask.description,
          dueDate: expect.stringContaining("2025-12-31"),
        })
      );

      expect(screen.getByText(newTask.title)).toBeInTheDocument();
    });

    it("shows validation errors when required fields are missing", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /Create Task/i }));

      const submitButton = screen.getByRole("button", { name: /Create Task/i });
      await user.click(submitButton);

      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });

    it("handles API errors during task creation", async () => {
      createTask.mockRejectedValueOnce(new Error("API Error"));

      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
      });

      const newTask = {
        title: "Task Title",
        description: "This should fail",
        day: "01",
        month: "01",
        year: "2025",
        time: "12:00",
      };

      await createTestTask(user, newTask);

      expect(createTask).toHaveBeenCalled();
    });
  });

  describe("FR2: Task Listing", () => {
    it("displays list of tasks from the API", async () => {
      render(<TaskManager />);

      await waitFor(() => {
        expect(fetchTasks).toHaveBeenCalled();
      });

      expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      expect(screen.getByText("Existing Task 2")).toBeInTheDocument();
    });

    it("shows loading state while fetching tasks", async () => {
      fetchTasks.mockImplementationOnce(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockTasks), 100))
      );

      render(<TaskManager />);

      expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
      });
    });

    it("handles empty task list gracefully", async () => {
      fetchTasks.mockResolvedValueOnce([]);

      render(<TaskManager />);

      await waitFor(() => {
        expect(fetchTasks).toHaveBeenCalled();
      });

      expect(
        screen.getByText(
          /Your task list is currently empty. Try creating a new task./i
        )
      ).toBeInTheDocument();
    });

    it("handles API errors when fetching tasks", async () => {
      fetchTasks.mockRejectedValueOnce(new Error("API Error"));

      render(<TaskManager />);

      await waitFor(() => {
        expect(fetchTasks).toHaveBeenCalled();
      });

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(/error retrieving your task list/i)
      ).toBeInTheDocument();
    });

    it("filters tasks by status correctly", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      await user.selectOptions(screen.getByRole("combobox"), "Completed");

      expect(screen.queryByText("Existing Task 1")).not.toBeInTheDocument();
      expect(screen.getByText("Existing Task 2")).toBeInTheDocument();
    });
  });

  describe("FR3: Task Viewing", () => {
    it("allows expanding a task to view details", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      expect(screen.getByText("This is the first task")).toBeInTheDocument();
      expect(screen.getByText(/Change Status/i)).toBeInTheDocument();
    });

    it("shows formatted due date in the task details", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      expect(
        screen.getByText(/1 May 2025/i) || screen.getByText(/May 1, 2025/i)
      ).toBeInTheDocument();
    });
  });

  describe("FR4: Task Status Updates", () => {
    it("allows changing task status from Pending to In Progress", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      await user.click(screen.getByRole("button", { name: /In Progress/i }));

      expect(updateTaskByID).toHaveBeenCalledWith(1, { status: "InProgress" });

      await waitFor(() => {
        expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
      });
    });

    it("allows changing task status from In Progress to Completed", async () => {
      fetchTasks.mockResolvedValueOnce([
        { ...mockTasks[0], status: "InProgress" },
      ]);

      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      await user.click(screen.getByRole("button", { name: /Completed/i }));

      expect(updateTaskByID).toHaveBeenCalledWith(1, { status: "Completed" });

      await waitFor(() => {
        expect(screen.getByText(/Completed/i)).toBeInTheDocument();
      });
    });

    it("handles API errors when updating status", async () => {
      updateTaskByID.mockRejectedValueOnce(new Error("API Error"));

      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      await user.click(screen.getByRole("button", { name: /In Progress/i }));

      expect(updateTaskByID).toHaveBeenCalled();

    });
  });

  describe("FR5: Task Deletion", () => {
    it("allows deleting a task with confirmation", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      await user.click(screen.getByRole("button", { name: /Delete/i }));

      await user.click(screen.getByText("Yes, Delete"));

      expect(deleteTaskByID).toHaveBeenCalledWith(1);

      await waitFor(() => {
        expect(screen.queryByText("Existing Task 1")).not.toBeInTheDocument();
      });
    });

    it("cancels deletion when user clicks Cancel", async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      await user.click(screen.getByRole("button", { name: /Delete/i }));

      await user.click(screen.getByText("Cancel"));

      expect(deleteTaskByID).not.toHaveBeenCalled();

      expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
    });

    it("handles API errors during deletion", async () => {
      deleteTaskByID.mockRejectedValueOnce(new Error("API Error"));

      const user = userEvent.setup();

      render(<TaskManager />);

      await waitFor(() => {
        expect(screen.getByText("Existing Task 1")).toBeInTheDocument();
      });

      const taskElement = screen.getByText("Existing Task 1").closest("div");
      await user.click(taskElement);

      await user.click(screen.getByRole("button", { name: /Delete/i }));

      await user.click(screen.getByText("Yes, Delete"));

      expect(deleteTaskByID).toHaveBeenCalled();
    });
  });
});
