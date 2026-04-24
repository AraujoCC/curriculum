import { Navigate } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

/**
 * Redirects unauthenticated users to the login page ("/").
 * Wrap any route that requires authentication with this component.
 */
export default function ProtectedRoute({ isAuthenticated, children }: Props) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
