import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./components/layout/Index";
import HomePage from "./pages/HomePage";
import UserSync from "./components/UserSync";
import EventPages from "./pages/EventPages";
import EventDetailpage from "./pages/EventDetailpage";
function App() {
  return (
    <Router>
      <UserSync />
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventPages />} />
          <Route path="events/:id" element={<EventDetailpage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
