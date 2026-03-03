import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="mx-auto mt-20 max-w-3xl px-4">
        <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-8 text-center shadow-xl">
          <span className="loading loading-spinner loading-md" />
          <p className="mt-3 text-sm text-base-content/70">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
