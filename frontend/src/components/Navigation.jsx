export default function Navigation() {
  return (
    <div className=" govuk-width-container">
      <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol class="govuk-breadcrumbs__list">
          <li class="govuk-breadcrumbs__list-item">
            <a class="govuk-breadcrumbs__link" href="/">
              HMCTS Employee Portal
            </a>
          </li>
          <li class="govuk-breadcrumbs__list-item">
            <a class="govuk-breadcrumbs__link" href="/">
              Your work and cases
            </a>
          </li>
          <li class="govuk-breadcrumbs__list-item">
            <a class="govuk-breadcrumbs__link" href="/">
              Task manager
            </a>
          </li>
        </ol>
      </nav>
    </div>
  );
}
