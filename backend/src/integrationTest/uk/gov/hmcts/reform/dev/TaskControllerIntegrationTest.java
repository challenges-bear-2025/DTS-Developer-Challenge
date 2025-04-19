package uk.gov.hmcts.reform.dev;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;
import uk.gov.hmcts.reform.dev.repository.TaskRepository;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Task createTask() {
        return new Task(
                "Task Title",
                "Task description",
                TaskStatus.Pending,
                LocalDateTime.now().plusDays(2)
        );
    }

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void shouldCreateTask() throws Exception {
        Task task = createTask();

        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Task Title"));
    }

    @Test
    void shouldGetTaskByID() throws Exception {
        Task savedTask = taskRepository.save(createTask());

        mockMvc.perform(get("/tasks/" + savedTask.getID()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(savedTask.getTitle()));
    }

    @Test
    void shouldGetAllTasks() throws Exception {
        Task task = taskRepository.save(createTask());

        mockMvc.perform(get("/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("[0].title").value("Task Title"));
    }

    @Test
    void shouldUpdateTask() throws Exception {
        Task savedTask = taskRepository.save(createTask());

        savedTask.setStatus(TaskStatus.Completed);

        mockMvc.perform(put("/tasks/" + savedTask.getID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(savedTask)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Completed"));
    }

    @Test
    void shouldDeleteTask() throws Exception {
        Task savedTask = taskRepository.save(createTask());

        mockMvc.perform(delete("/tasks/" + savedTask.getID()))
                .andExpect(status().isNoContent());

        // Confirmation that task has been removed from list of tasks
        mockMvc.perform(get("/tasks/" + savedTask.getID()))
                .andExpect(status().isNotFound());
    }

}
