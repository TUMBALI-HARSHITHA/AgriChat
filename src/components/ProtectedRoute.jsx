import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('agrichat_token');
  
  if (!token) {
    // Redirect to login page if no auth token is found
    return <Navigate to="/login" replace />;
  }

  return children;
}
