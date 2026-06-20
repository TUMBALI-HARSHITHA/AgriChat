import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Chat from './pages/Chat';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Wrapper to conditionally hide footer on Chat page for better UX
function Layout() {
  const location = useLocation();
  const hideFooter = location.pathname === '/chat';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-16 text-center px-4">
                <div className="text-7xl mb-2">🌾</div>
                <h2 className="text-3xl font-bold text-white font-['Plus_Jakarta_Sans']">Page not found</h2>
                <p className="text-gray-500 max-w-xs">
                  Looks like this field hasn't been sown yet. Let's head back to familiar ground.
                </p>
                <a href="/" className="btn-primary mt-4">Back to Home</a>
              </div>
            }
          />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
