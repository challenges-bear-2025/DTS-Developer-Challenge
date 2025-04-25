export default function DeleteConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div class="govuk-warning-text">
          <span class="govuk-warning-text__icon" aria-hidden="true">
            !
          </span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-visually-hidden">Warning</span>
            Are you sure you want to delete this task?
          </strong>
        </div>
        <p className="govuk-body">This action cannot be undone.</p>
        <div className="govuk-button-group">
          <button
            className="govuk-button govuk-button--warning"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="govuk-button govuk-button--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
