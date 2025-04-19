package uk.gov.hmcts.reform.dev;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;
import uk.gov.hmcts.reform.dev.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TaskRepositoryIntegrationTest {

    @Autowired
    private TaskRepository taskRepository;

    private Task createTask() {
        return new Task(
                "Test Task",
                "Test task description",
                TaskStatus.Pending,
                LocalDateTime.now().plusDays(2)
        );
    }

    @Test
    void shouldCreateTask() {
        Task task = createTask();

        Task createdTask = taskRepository.save(task);

        assertThat(createdTask.getID()).isNotNull();
        assertThat(createdTask.getTitle()).isEqualTo("Test Task");
        assertThat(createdTask.getDescription()).isEqualTo("Test task description");
        assertThat(createdTask.getStatus()).isEqualTo(TaskStatus.Pending);
        assertThat(createdTask.getDueDate()).isEqualTo(task.getDueDate());
    }

    @Test
    void shouldRetrieveTaskByID() {
        Task task =  taskRepository.save(createTask());

        Optional<Task> retrieved = taskRepository.findById(task.getID());

        assertThat(retrieved).isPresent();
        assertThat(retrieved.get().getTitle()).isEqualTo("Test Task");
    }

    @Test
    void shouldRetrieveAllTasks() {
        taskRepository.save(createTask());
        taskRepository.save(createTask());
        taskRepository.save(createTask());

        List<Task> tasks = taskRepository.findAll();

        assertThat(tasks).hasSize(3);
    }

    @Test
    void shouldUpdateTaskStatus() {
        Task task = taskRepository.save(createTask());

        task.setStatus(TaskStatus.Completed);
        Task updatedTask = taskRepository.save(task);

        assertThat(updatedTask.getStatus()).isEqualTo(TaskStatus.Completed);
    }

    @Test
    void shouldDeleteTask() {
        Task task = taskRepository.save(createTask());

        taskRepository.deleteById(task.getID());
        Optional<Task> deleted = taskRepository.findById(task.getID());

        assertThat(deleted).isNotPresent();
    }
}
