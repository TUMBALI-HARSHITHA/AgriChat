import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home      from './pages/Home';
import Chat      from './pages/Chat';
import About     from './pages/About';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function Layout() {
  const { pathname } = useLocation();
  const isChat = pathname === '/chat';

  return (
    /* stretch full viewport, column direction */
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* main grows to fill remaining space */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/chat"      element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/about"     element={<About />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route
            path="*"
            element={
              <div
                style={{ paddingTop: '64px' }}
                className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4"
              >
                <div className="text-7xl">🌾</div>
                <h2 className="text-3xl font-bold text-white">Page not found</h2>
                <p className="text-gray-500 max-w-xs">
                  Looks like this field hasn't been sown yet.
                </p>
                <a href="/" className="btn-primary mt-2">Back to Home</a>
              </div>
            }
          />
        </Routes>
      </main>

      {/* hide footer only on /chat for UX; all other pages show it */}
      {!isChat && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
