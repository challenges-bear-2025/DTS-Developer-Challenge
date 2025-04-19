package uk.gov.hmcts.reform.dev.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.service.TaskService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/{ID}")
    public ResponseEntity<Task> getTaskByID(@PathVariable Long ID) {
        Optional<Task> task = taskService.getTaskByID(ID);
        return task.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> task = taskService.getAllTasks();
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{ID}")
    public ResponseEntity<Task> updateTaskByID(@PathVariable Long ID, @RequestBody Task updatedTask) {
        Optional<Task> updated = taskService.updateTask(ID, updatedTask);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{ID}")
    public ResponseEntity<Void> deleteTaskByID(@PathVariable Long ID) {
        taskService.deleteTask(ID);
        return ResponseEntity.noContent().build();
    }
}
