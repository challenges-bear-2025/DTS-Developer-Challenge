/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-node-access */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import TaskList from "../../components/TaskList";
import {
  fetchTasks,
  createTask,
  fetchTaskByID,
  updateTaskByID,
  deleteTaskByID,
} from "../../api/taskApi";

jest.mock("../../api/taskApi.js");

const mockTasks = [
  {
    id: 1,
    title: "Test Task 1",
    description: "",
    dueDate: "2025-05-01T16:00:00",
    status: "Pending",
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "",
    dueDate: "2025-05-01T16:00:00",
    status: "Completed",
  },
];

jest.spyOn(global, "fetch").mockResolvedValueOnce({
  json: () => Promise.resolve(mockTasks),
});

describe("TaskList Component", () => {
  beforeEach(() => {
    fetchTasks.mockResolvedValue(mockTasks);
    fetchTaskByID.mockResolvedValue(mockTasks[0]);
    createTask.mockResolvedValue({
      id: 3,
      name: "Test Task 3",
      status: "Pending",
    });
    updateTaskByID.mockResolvedValue({
      id: 1,
      name: "Test Task 1",
      status: "InProgress",
    });
    deleteTaskByID.mockResolvedValue();
  });

  test("fetches and displays tasks after loading", async () => {
    await act(async () => {
      render(<TaskList />);
    });

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });

  test("displays error message on API failure", async () => {
    fetchTasks.mockRejectedValueOnce(new Error("Failed to load tasks"));

    await act(async () => {
      render(<TaskList />);
    });

    await screen.findByRole("alert");
    expect(
      screen.getByText("There was an error retrieving your task list")
    ).toBeInTheDocument();
  });

  test("filters tasks by status", async () => {
    await act(async () => {
      render(<TaskList />);
    });

    await screen.findByText("Test Task 1");

    // Change filter to "Completed"
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Completed" },
    });

    // Verify filtered task is displayed
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    expect(screen.queryByText("Test Task 1")).not.toBeInTheDocument();
  });

  test("toggles task creation form visibility", async () => {
    await act(async () => {
      render(<TaskList />);
    });

    await screen.findByText("Test Task 1");

    const createButton = screen.getByText("Create Task");
    fireEvent.click(createButton);
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  test("handleCreateTask adds a new task to the list", async () => {
    // 1. Setup test data
    const newTask = {
      title: "Test Task 3",
      description: "Test description",
      dueDate: "2025-05-02T16:00:00",
      status: "Pending",
    };

    const [date, time] = newTask.dueDate.split("T");
    const [year, month, day] = date.split("-");
    const [hours, minutes, seconds] = time.split(":");

    const createdTask = {
      id: 3,
      ...newTask,
    };

    // 2. Mock the API call
    createTask.mockResolvedValueOnce(createdTask);

    // 3. Render the component
    await act(async () => {
      render(<TaskList />);
    });

    // 4. Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
    });

    // 5. Get the initial task count
    const initialTaskCount = screen.getAllByText(/Test Task/i).length;

    // 6. Click the "Create Task" button to show the form
    fireEvent.click(screen.getByText("Create Task"));

    // 7. Find the form element (adjust selectors based on your actual component)
    const form = document.querySelector("form");

    // If you can't find the form directly, you might need to use more specific selectors
    // const form = screen.getByRole("form") ||
    //              screen.getByTestId("task-form") ||
    //              document.querySelector("form");

    if (!form) {
      throw new Error("Could not find form element");
    }

    // 8. Fill out the form fields
    // Find input fields - adjust these selectors based on your actual form
    const titleInput =
      form.querySelector('input[name="title"]') ||
      screen.getByLabelText(/Task Title/i) ||
      screen.getAllByRole("textbox")[0];

    const descriptionInput =
      form.querySelector('input[name="description"]') ||
      form.querySelector('textarea[name="description"]') ||
      screen.getByLabelText(/Task Description/i) ||
      screen.getAllByRole("textbox")[1];

    const dueDateDayInput =
      form.querySelector('input[name="task-due-day"]') ||
      screen.getByLabelText(/Day/i);
    const dueDateMonthInput =
      form.querySelector('input[name="task-due-month"]') ||
      screen.getByLabelText(/Month/i);
    const dueDateYearInput =
      form.querySelector('input[name="task-due-year"]') ||
      screen.getByLabelText(/Year/i);
    const dueDateTimeInput =
      form.querySelector('input[name="task-due-time"]') ||
      screen.getByLabelText(/Time/i);

    // Fill in the form fields
    if (titleInput)
      fireEvent.change(titleInput, { target: { value: newTask.title } });
    if (descriptionInput)
      fireEvent.change(descriptionInput, {
        target: { value: newTask.description },
      });
    if (dueDateDayInput)
      fireEvent.change(dueDateDayInput, {
        target: { value: day },
      });
    if (dueDateMonthInput)
      fireEvent.change(dueDateMonthInput, {
        target: { value: month },
      });
    if (dueDateYearInput)
      fireEvent.change(dueDateYearInput, {
        target: { value: year },
      });
    if (dueDateTimeInput)
      fireEvent.change(dueDateTimeInput, {
        target: { value: `${hours}:${minutes}` }, // If you're only using time up to minutes
      });

    // 9. Submit the form
    const submitButton =
      form.querySelector('button[type="submit"]') ||
      screen.getByText(/Create Task/i);

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // 10. Verify createTask was called with the right data
    await waitFor(() => {
      expect(createTask).toHaveBeenCalled();
    });

    // 11. Verify the new task appears in the list
    await waitFor(() => {
      const finalTaskCount = screen.getAllByText(/Test Task /i).length;
      expect(finalTaskCount).toBe(initialTaskCount + 1);
    });
  });

  test("updates task status", async () => {
    await act(async () => {
      render(<TaskList />);
    });

    await screen.findByText("Test Task 1");

    fireEvent.click(screen.getByText("In Progress"));

    await screen.findByText("Test Task 1");
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  test("deletes a task", async () => {
    await act(async () => {
      render(<TaskList />);
    });

    await screen.findByText("Test Task 1");
    fireEvent.click(
      screen.getByRole("heading", { name: /Test Task 1/i }).closest("div")
    );
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    fireEvent.click(screen.getByText("Yes, Delete"));
    await waitFor(() =>
      expect(screen.queryByText("Test Task 1")).not.toBeInTheDocument()
    );
    expect(deleteTaskByID).toHaveBeenCalledWith(1);
  });

  test("displays empty task list message when no tasks", async () => {
    fetchTasks.mockResolvedValueOnce([]);

    await act(async () => {
      render(<TaskList />);
    });

    await screen.findByText(/Your task list is currently empty/i);
    expect(
      screen.getByText("Click the button above to add your first task.")
    ).toBeInTheDocument();
  });
});
