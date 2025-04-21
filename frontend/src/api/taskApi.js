import axios from 'axios';

const  API_URL = '/tasks';

export async function createTask(task) {
    const response = await axios.post(API_URL, task);
    return response.data;
}

export async function fetchTaskByID(ID) {
    const response = await axios.get(`${API_URL}/${ID}`);
    return response.data;
}

export async function fetchTasks() {
    const response = await axios.get(API_URL);
    return response.data;
}

export async function updateTaskByID(ID, task) {
    const response = await axios.put(`${API_URL}/${ID}`, task);
    return response.data;
}

export async function deleteTask(ID) {
    await axios.delete(`${API_URL}/${ID}`);
}
