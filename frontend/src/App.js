import { initGovUK } from "./utils/govuk-init";
import "./styles/main.scss";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TaskManager from "./views/TaskManager";
import Navigation from "./components/Navigation";

function App() {
  useEffect(() => {
    initGovUK();
  }, []);

  return (
    <div>
      <Header />
      <Navigation />
      <TaskManager />
      <Footer />
    </div>
  );
}

export default App;
