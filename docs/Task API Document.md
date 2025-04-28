# Task API Documentation

## Overview
This API allows the management of tasks, including creation, retrieval, updating of status, and deletion of task records. It supports RESTful principles and allows interaction through HTTP requests.

### Base URL
http://localhost:8080/tasks

## Endpoints

### 1. **Create a Task**

- **Endpoint**: `POST /tasks`
- **Description**: Creates a new task.
- **Request Body**:
  - The task object to be created. The object must include:
    - `title` (string): The title of the task.
    - `description` (string): A description of the task.
    - `status` (string): The current status of the task (e.g., `"InProgress"`, `"Completed"`).
    - `dueDate` (localDateTime) The deadline for the task. (e.g., `"2025-04-23T15:30:00"`).

    **Example Request Body**:
    ```json
    {
      "title": "Sample Task",
      "description": "This is a sample task",
      "status": "Pending",
      "dueDate": "2025-04-23T15:30:00"
    }
    ```

- **Response**:
  - **Status Code**: `201 Created`
  - **Body**: The created task object, including a generated `id`.
  
    **Example Response**:
    ```json
    {
      "id": 1,
      "name": "Sample Task",
      "description": "This is a sample task",
      "status": "Pending",
      "dueDate": "2025-04-23T15:30:00"
    }
    ```

---

### 2. **Get Task by ID**

- **Endpoint**: `GET /tasks/{ID}`
- **Description**: Retrieves a task by its ID.
- **Path Parameters**:
  - `ID` (required): The ID of the task to retrieve.

- **Response**:
  - **Status Code**: `200 OK` (if the task is found)
  - **Status Code**: `404 Not Found` (if the task is not found)
  
    **Example Response (Task Found)**:
    ```json
    {
      "id": 1,
      "name": "Sample Task",
      "description": "This is a sample task",
      "status": "Pending",
      "dueDate": "2025-04-23T15:30:00"
    }
    ```
    
    **Example Response (Task Not Found)**:
    ```json
    {
      "error": "Task not found"
    }
    ```

---

### 3. **Get All Tasks**

- **Endpoint**: `GET /tasks`
- **Description**: Retrieves all tasks.
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**: An array of task objects.
  
    **Example Response**:
    ```json
    [
      {
        "id": 1,
        "name": "Sample Task 1",
        "description": "This is a sample task",
        "status": "Pending",
        "dueDate": "2025-04-30T15:30:00"
      },
      {
        "id": 2,
        "name": "Sample Task 2",
        "description": "Another task",
        "status": "Completed",
        "dueDate": "2025-04-30T15:30:00"
      }
    ]
    ```

---

### 4. **Update a Task by ID**

- **Endpoint**: `PUT /tasks/{ID}`
- **Description**: Updates a task by its ID.
- **Path Parameters**:
  - `ID` (required): The ID of the task to be updated.
  
- **Request Body**:
  - The task object with updated details. The object must include:
    - `title` (string): The updated name of the task.
    - `description` (string): The updated description of the task.
    - `status` (string): The updated status of the task.
    - `dueDate` (localDateTime): The deadline for the task.
  
    **Example Request Body**:
    ```json
    {
      "title": "Updated Task",
      "description": "Updated task description",
      "status": "InProgress",
      "dueDate": "2025-04-30T16:30:00"
    }
    ```

- **Response**:
  - **Status Code**: `200 OK` (if the task is updated successfully)
  - **Status Code**: `404 Not Found` (if the task is not found)
  
    **Example Response (Task Updated)**:
    ```json
    {
      "id": 1,
      "title": "Updated Task",
      "description": "Updated task description",
      "status": "InProgress",
      "dueDate": "2025-04-30T16:30:00"
    }
    ```

---

### 5. **Delete a Task by ID**

- **Endpoint**: `DELETE /tasks/{ID}`
- **Description**: Deletes a task by its ID.
- **Path Parameters**:
  - `ID` (required): The ID of the task to be deleted.

- **Response**:
  - **Status Code**: `204 No Content` (if the task is deleted successfully)
  - **Body**: None

---
