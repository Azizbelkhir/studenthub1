import { BrowserRouter, Routes, Route, Navigate } from './router';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, ToastContainer } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { StudentsPage } from './pages/StudentsPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div style={{ minHeight: '100vh' }}>
            {/* Navbar - hidden on login page */}
            <Routes>
              <Route path="/login" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>

            {/* Pages */}
            <Routes>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global Toast Notifications */}
            <ToastContainer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
