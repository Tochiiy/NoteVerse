import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../features/auth/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Name, email and password are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await register({ name, email, password });
      navigate("/profile", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-xl px-4">
        <section className="rounded-3xl border border-base-content/10 bg-base-100/75 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-base-content">
            Create Account
          </h1>
          <p className="mt-2 text-base-content/70">
            Register to get your personal profile and secure access.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="form-control w-full">
              <span className="label-text mb-2 text-sm font-semibold">
                Name
              </span>
              <input
                type="text"
                className="input input-bordered rounded-xl"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSubmitting}
                placeholder="Your name"
              />
            </label>

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
                placeholder="Minimum 6 characters"
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
              {isSubmitting ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-sm text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
