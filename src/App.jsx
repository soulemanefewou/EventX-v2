import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from './components/layout/Index';
import HomePage from './pages/HomePage';
function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index/>}>
           <Route index element={<HomePage/>}/>
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App
