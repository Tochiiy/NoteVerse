import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../features/auth/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email, password });
      navigate(fromPath, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-xl px-4">
        <section className="rounded-3xl border border-base-content/10 bg-base-100/75 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-base-content">Login</h1>
          <p className="mt-2 text-base-content/70">
            Sign in to access your profile and protected actions.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="form-control w-full">
              <span className="label-text mb-2 text-sm font-semibold">
                Email
              </span>
              <input
                type="email"
                className="input input-bordered rounded-xl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                placeholder="you@example.com"
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-2 text-sm font-semibold">
                Password
              </span>
              <input
                type="password"
                className="input input-bordered rounded-xl"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
              />
            </label>

            <button
              className="btn btn-primary w-full rounded-xl"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-base-content/70">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="link link-primary font-semibold">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
