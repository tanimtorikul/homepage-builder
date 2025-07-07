import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageBuilder from "./pages/PageBuilder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageBuilder />} />

      </Routes>
      <Toaster/>
    </Router>
  );
}

export default App;

