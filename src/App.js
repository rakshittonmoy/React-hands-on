import CandidatesTable from './components/CandidatesTable/CandidatesTable';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <CandidatesTable />
      </div>
    </Router>
  );
}

export default App;
