import { Navigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';

export default function ProtectedRoute({ children }) {
  const currentUser = useStore(state => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}


