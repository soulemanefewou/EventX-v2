import "./App.css";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./components/layout/Index";
import HomePage from "./pages/HomePage";
import UserSync from "./components/UserSync";
import EventPages from "./pages/EventPages";
import EventDetailpage from "./pages/EventDetailpage";
import BookingsPage from "./pages/MyTicketPage";
import MyTicketPage from "./pages/MyTicketPage";
import { useAuth } from "./hooks/useAuth";
import MyWorkSpacePage from "./pages/MyWorkSpacePage";
import AdminPage from "./pages/AdminPage";



const ProtectedRoute = ({ children }) => {
  const {isAuthenticated, loading} = useAuth();

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 ">Vérification en cours...</p>
        </div>
      </div>
    )
  }
  if(!isAuthenticated){
    return <Navigate to="/" replace/>
  }

  return children
}

// Route admin protégée avec Convex
const AdminRoute = ({children}) => {
  const {user, isAuthenticated, loading} = useAuth()
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL || user?.role === "admin"
   if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 ">Vérification en cours...</p>
        </div>
      </div>
    )
  }
  if(!isAuthenticated || !isAdmin){
    return <Navigate to="/" replace/>
  }

  return children
}
  



function App() {
  return (
    <Router>
      <UserSync />
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventPages />} />
          <Route path="events/:id" element={<EventDetailpage />} />

          {/* Routes protégées - nécessite authentification*/}
          <Route path="my-tickets" element= {
            <ProtectedRoute>
              <MyTicketPage/>
            </ProtectedRoute>
          }/>

          <Route path="my-workspace" element= {
            <ProtectedRoute>
              <MyWorkSpacePage/>
            </ProtectedRoute>
          }/>


          <Route path="admin" element= {
            <AdminRoute>
              <AdminPage/>
            </AdminRoute>
          }/>

          <Route path="*" element={<Navigate to="/" replace/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
