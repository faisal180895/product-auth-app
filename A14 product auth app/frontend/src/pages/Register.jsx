import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../services/api.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await request("/auth/register", {
        method: "POST",
        body: { name, email, password },
      });

      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Product Auth App</p>
        <h1>Create account</h1>
        <p className="page-copy">
          Register once, then use the protected product dashboard.
        </p>

        <form className="form-grid" onSubmit={submit}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Choose a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="message error-message">{error}</p> : null}
          {success ? <p className="message success-message">{success}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="inline-note">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
