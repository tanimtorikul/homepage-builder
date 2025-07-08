import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageBuilder from "./pages/PageBuilder";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageBuilder />} />
        <Route path="/home" element={<HomePage />} />

      </Routes>
      <Toaster/>
    </Router>
  );
}

export default App;

