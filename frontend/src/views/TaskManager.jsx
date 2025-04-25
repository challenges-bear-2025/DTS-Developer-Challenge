import TaskList from "../components/TaskList";

export default function TaskManager() {
  return (
    <div id="wrapper" className="govuk-width-container">
      <main role="main" id="content" className="govuk-main-wrapper">
        <div className=" govuk-!-margin-bottom-8">
        <span class="govuk-caption-xl">Manage and track your casework tasks</span>
          <h1 className="govuk-heading-xl">Task Manager</h1>
          
        </div>
        <div className="govuk-!-margin-bottom-8">
      <h2 className="govuk-heading-l">Your Tasks</h2>
      <TaskList />
    </div>
        
      </main>
    </div>
  );
}
