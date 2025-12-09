import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
// IMPORTAMOS LA NUEVA PÁGINA
import AnimalDetailsPage from './pages/AnimalDetailsPage'; 

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || !user.token) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* AGREGAMOS LA NUEVA RUTA DINÁMICA */}
          {/* :id indica que esa parte de la URL va a cambiar */}
          <Route path="/animal/:id" element={<AnimalDetailsPage />} />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;