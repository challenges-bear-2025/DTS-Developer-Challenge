package uk.gov.hmcts.reform.dev.service;

import org.springframework.beans.factory.annotation.Autowired;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.repository.TaskRepository;

import java.util.List;
import java.util.Optional;

public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskByID(Long ID) {
        return taskRepository.findById(ID);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> updateTask(Long ID, Task updatedTask) {
        return taskRepository.findById(ID).map(
                existingTask -> {
                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setDescription(updatedTask.getDescription());
                    existingTask.setStatus(updatedTask.getStatus());
                    existingTask.setDueDate(updatedTask.getDueDate());
                    return taskRepository.save(existingTask);
                });
    }

    public void deleteTask(Long ID) {
        taskRepository.deleteById(ID);
    }
}
