import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
 return (
 <ThemeProvider>
 <Router basename="/FindNew">
 <Routes>
 <Route path="/" element={<LandingPage />} />
 <Route path="/auth" element={<AuthPage />} />
 <Route path="/dashboard/*" element={<DashboardPage />} />
 </Routes>
 </Router>
 </ThemeProvider>
 );
}

export default App;
