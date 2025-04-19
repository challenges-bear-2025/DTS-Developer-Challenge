package uk.gov.hmcts.reform.dev;

import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;
import uk.gov.hmcts.reform.dev.repository.TaskRepository;
import uk.gov.hmcts.reform.dev.service.TaskService;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TaskServiceIntegrationTest {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    private Task createTask() {
        return new Task(
                "Task Title",
                "Task description",
                TaskStatus.Pending,
                LocalDateTime.now().plusDays(3)
        );
    }

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @Test
    void shouldCreateTask() {
        Task task = createTask();

        Task createdTask = taskService.createTask(task);

        assertNotNull(createdTask.getID());
        assertEquals("Task Title", createdTask.getTitle());
        assertEquals("Task description", createdTask.getDescription());
        assertEquals(TaskStatus.Pending, createdTask.getStatus());
        assertEquals(task.getDueDate(), createdTask.getDueDate());
    }

    @Test
    void shouldGetTaskByID() {
        Task savedTask = taskRepository.save(createTask());

        Optional<Task> foundTask = taskService.getTaskByID(savedTask.getID());

        assertTrue(foundTask.isPresent());
        assertEquals(savedTask.getTitle(), foundTask.get().getTitle());
        assertEquals(savedTask.getDescription(), foundTask.get().getDescription());
    }

    @Test
    void shouldGetAllTasks() {
        Task task1 = taskRepository.save(createTask());
        Task task2 = taskRepository.save(createTask());

        var tasks = taskService.getAllTasks();

        assertEquals(2, tasks.size());
        assertTrue(tasks.stream().anyMatch(task -> task.getID().equals(task1.getID())));
        assertTrue(tasks.stream().anyMatch(task -> task.getID().equals(task2.getID())));
    }

    @Test
    void shouldUpdateTaskByID() {
        Task savedTask = taskRepository.save(createTask());

        Task updatedTask = new Task(
                savedTask.getTitle(),
                "Updated description",
                TaskStatus.Completed,
                savedTask.getDueDate()
        );

        Task result = taskService.updateTask(savedTask.getID(), updatedTask).orElseThrow();

        assertEquals("Updated description", result.getDescription());
        assertEquals(TaskStatus.Completed, result.getStatus());
    }

    @Test
    void shouldDeleteTaskByID() {
        Task savedTask = taskRepository.save(createTask());

        taskService.deleteTask(savedTask.getID());

        Optional<Task> deletedTask = taskService.getTaskByID(savedTask.getID());

        assertFalse(deletedTask.isPresent());
    }

}
