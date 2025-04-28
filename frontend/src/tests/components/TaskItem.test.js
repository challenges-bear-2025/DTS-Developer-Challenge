/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "../../components/TaskItem";

const mockTask = {
  id: "1",
  title: "Test Task",
  description: "This is a test task",
  status: "Pending",
  dueDate: new Date(Date.now() + 86400000).toISOString(),
};

describe("TaskItem", () => {
  it("renders task title and due date", () => {
    render(<TaskItem task={mockTask} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  it("toggles expanded details when header clicked", () => {
    render(<TaskItem task={mockTask} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    const header = screen.getByRole("heading", { name: /Test Task/i }).closest("div");
    fireEvent.click(header);
    expect(screen.getByText(/Change Status/)).toBeInTheDocument();
    fireEvent.click(header);
    expect(screen.queryByText(/Change Status/)).not.toBeInTheDocument();
  });

  it("calls onUpdate with correct status when status button clicked", () => {
    const onUpdateMock = jest.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdateMock} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByRole("heading", { name: /Test Task/i }).closest("div"));
    fireEvent.click(screen.getByRole("button", { name: "In Progress" }));

    expect(onUpdateMock).toHaveBeenCalledWith(expect.objectContaining({ status: "InProgress" }));
  });

  it("shows delete modal and calls onDelete when confirmed", () => {
    const onDeleteMock = jest.fn();
    render(<TaskItem task={mockTask} onUpdate={jest.fn()} onDelete={onDeleteMock} />);
    
    fireEvent.click(screen.getByRole("heading", { name: /Test Task/i }).closest("div"));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByText("Yes, Delete"));

    expect(onDeleteMock).toHaveBeenCalledWith("1");
  });
});