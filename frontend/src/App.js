import { initGovUK } from "./utils/govuk-init";
import './styles/main.scss'
import { useEffect } from "react";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    initGovUK();
  }, [])

  return (
    <div className="App">
      <Header serviceName="Task Management System"/>
    </div>
  );
}

export default App;
