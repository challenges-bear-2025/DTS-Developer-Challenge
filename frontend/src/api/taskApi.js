import axios from "axios";

const API_URL = "http://localhost:8080/tasks";

export async function createTask(task) {
  console.log("Creating task:", task);
  try {
    const response = await axios.post(API_URL, task);
    console.log("Task created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function fetchTaskByID(ID) {
  console.log("Fetching task with ID:", ID);
  try {
    const response = await axios.get(`${API_URL}/${ID}`);
    console.log("Fetched task:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
}

export async function fetchTasks() {
  console.log("Fetching all tasks...");
  try {
    const response = await axios.get(API_URL);
    console.log("Fetched tasks:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function updateTaskByID(id, task) {
  console.log("Updating task with ID:", id, "Task data:", task);
  try {
    const response = await axios.put(`${API_URL}/${id}`, task);
    console.log("Task updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function deleteTaskByID(ID) {
  console.log("Deleting task with ID:", ID);
  try {
    await axios.delete(`${API_URL}/${ID}`);
    console.log("Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
