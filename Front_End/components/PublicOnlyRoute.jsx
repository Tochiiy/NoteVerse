import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();

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

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicOnlyRoute;
