import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AIChatBot from './components/AIChatBot';
import Contact from './pages/Contact';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Patient routes - with Navbar */}
          <Route path="/" element={<><Navbar /><Home /><AIChatBot /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/doctors" element={<><Navbar /><Doctors /><AIChatBot /></>} />
          <Route path="/book-appointment/:id" element={<><Navbar /><BookAppointment /></>} />
          <Route path="/appointments" element={<><Navbar /><MyAppointments /></>} />
          <Route path="/contact" element={<><Navbar /><Contact /></>} />         
          
          {/* Admin routes - no Navbar, own layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/doctors" element={
            <AdminRoute><AdminDoctors /></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminUsers /></AdminRoute>
          } />
          <Route path="/admin/appointments" element={
            <AdminRoute><AdminAppointments /></AdminRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;