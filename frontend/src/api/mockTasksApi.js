let mockTasks = [
  {
    ID: 1,
    title: "Task One",
    description: "First task description",
    status: "Pending",
    dueDate: generateDueDate(1)
  },
  {
    ID: 2,
    title: "Task Two",
    description: "Second task description",
    status: "InProgress",
    dueDate: generateDueDate(2)
  },
  {
    ID: 3,
    title: "Task Three",
    description: "Third task description",
    status: "Completed",
    dueDate: generateDueDate(3)
  },
];

let nextID = 4;

function simulateDelay(result) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(result), 500);
    });
}

function generateDueDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString();
}

export async function createTask(task) {
    const newTask = {
        ID: nextID++,
        ...task,
        dueDate: task.dueDate || generateDueDate(7)
    };
    mockTasks.push(newTask);
    return simulateDelay({ ...newTask });
}

export async function fetchTaskByID(ID) {
    const task = mockTasks.find(task => task.ID === ID);
    if (!task) throw new Error('Task not found');
    return simulateDelay({ ...task });
}

export async function fetchTasks() {
    return simulateDelay([...mockTasks]);
}

export async function updateTaskByID(updatedTask) {
    const index = mockTasks.findIndex(task => task.ID === updatedTask.ID);
    if (index === -1) throw new Error('Task not found');
    mockTasks[index] = { ...updatedTask };
    return simulateDelay({ ...mockTasks[index] });
}

export async function deleteTaskByID(ID) {
    mockTasks = mockTasks.filter(task => task.ID !== ID);
    return simulateDelay();
}
