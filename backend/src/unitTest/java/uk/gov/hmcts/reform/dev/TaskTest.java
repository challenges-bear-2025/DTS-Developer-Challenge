package java.uk.gov.hmcts.reform.dev;

import jakarta.validation.ConstraintViolation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.Validator;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class TaskTest {

	private Validator validator;

	@BeforeEach
    void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

	private Task createValidTask() {
		return new Task(
				"Valid Title",
				"Valid Description",
				TaskStatus.InProgress,
				LocalDateTime.now().plusDays(1)
		);
	}

	@Test
	void validationShouldPass_whenTaskIsValid() {
		Task task = createValidTask();

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertTrue(violations.isEmpty(), "Expected no validation violations for a valid task");
	}

	// Title validation
	@Test
	void validationShouldFail_whenTitleIsNull() {
		Task task = createValidTask();
		task.setTitle(null);

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertFalse(violations.isEmpty());
		assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("title")));
	}

	@Test
	void validationShouldFail_whenTitleIsBlank() {
		Task task = createValidTask();
		task.setTitle(" ");

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertFalse(violations.isEmpty());
		assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("title")));
	}

	@Test
	void validationShouldFail_whenTitleIsTooLong() {
		Task task = createValidTask();
		task.setTitle("A".repeat(256));

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertFalse(violations.isEmpty());
		assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("title")));
	}

	// Description validation
	@Test
	void validationShouldFail_whenDescriptionIsTooLong() {
		Task task = createValidTask();
		task.setDescription("A".repeat(1001));

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertFalse(violations.isEmpty());
		assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("description")));
	}

	// Status validation
	@Test
	void validationShouldFail_whenStatusIsNull() {
		Task task = createValidTask();
		task.setStatus(null);

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertFalse(violations.isEmpty());
		assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("status")));
	}

	// Due data validation
	@Test
	void validationShouldFail_whenDueDateIsNull() {
		Task task = createValidTask();
		task.setDueDate(null);

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertFalse(violations.isEmpty());
		assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("dueDate")));
	}

	@Test
	void validationShouldFail_whenDueDateIsInThePast() {
		Task task = createValidTask();
		task.setDueDate(LocalDateTime.now().minusDays(1));

		Set<ConstraintViolation<Task>> violations = validator.validate(task);

		assertFalse(violations.isEmpty());
		assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("dueDate")));
	}
	}

