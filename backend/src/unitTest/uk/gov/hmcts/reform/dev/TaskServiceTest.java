package uk.gov.hmcts.reform.dev;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;
import uk.gov.hmcts.reform.dev.repository.TaskRepository;
import uk.gov.hmcts.reform.dev.service.TaskService;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.as;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    private TaskRepository taskRepository;
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        taskService = new TaskService(taskRepository);
    }

    private Task createTask() {
        return new Task(
                "Task Title",
                "Test task description",
                TaskStatus.Pending,
                LocalDateTime.now().plusDays(3)
        );
    }

    @Test
    void shouldCreateTask() {
        Task task = createTask();
        when(taskRepository.save(task)).thenReturn(task);

        Task createdTask = taskService.createTask(task);

        assertThat(createdTask).isNotNull();
        assertThat(createdTask.getTitle()).isEqualTo("Task Title");
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void shouldGetTaskByID() {
        Task task = createTask();
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Optional<Task> retrievedTask = taskService.getTaskByID(1L);

        assertThat(retrievedTask).isPresent();
        assertThat(retrievedTask.get().getTitle()).isEqualTo("Task Title");
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void shouldGetAllTasks() {
        List<Task> tasks = Arrays.asList(createTask(), createTask(), createTask());
        when(taskRepository.findAll()).thenReturn(tasks);

        List<Task> retrievedTasks = taskService.getAllTasks();

        assertThat(retrievedTasks).hasSize(3);
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void shouldUpdateTask() {
        Task task = createTask();
        Task updatedTask = new Task("Updated Task Title", "Updated test description", TaskStatus.Completed, LocalDateTime.now().plusDays(4));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);

        Optional<Task> result = taskService.updateTask(1L, updatedTask);

        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Updated Task Title");
        assertThat(result.get().getStatus()).isEqualTo(TaskStatus.Completed);
        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void shouldDeleteTask() {
        doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }
}
