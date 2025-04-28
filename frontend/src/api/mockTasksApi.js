let mockTasks = [
  {
    ID: 1,
    title: "Review case documents",
    description: "Review all documents for the Smith vs. Jones case before the hearing.Review all documents for the Smith vs. Jones case before the hearing.Review all documents for the Smith vs. Jones case before the hearing.Review all documents for the Smith vs. Jones case before the hearing.Review all documents for the Smith vs. Jones case before the hearing.Review all documents for the Smith vs. Jones case before the hearing.",
    status: "InProgress",
    dueDate: generateDueDate(1)
  },
  {
    ID: 2,
    title: "Prepare court filing",
    description: "Draft and prepare court filing for the Johnson case.",
    status: "Pending",
    dueDate: generateDueDate(5)
  },
  {
    ID: 3,
    title: "Schedule client meeting",
    description: "Arrange a meeting with Mrs. Williams to discuss case progress.",
    status: "Pending",
    dueDate: generateDueDate(8)
  },
  {
    ID: 4,
    title: "Update case management system",
    description: "Enter recent developments in the Thompson case into the system.",
    status: "Pending",
    dueDate: generateDueDate(10)
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
