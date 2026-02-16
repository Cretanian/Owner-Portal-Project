import React, { useState } from "react";
import { login } from "../../../../api/auth";
import Heading from "../../../components/heading/Heading";
import LoaderContainer from "../../../components/loaderContainer/LoaderContainer";

import styles from "./LoginPage.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);

      window.location.reload();
    } catch {
      setIsSubmitting(false);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.page}>
      <LoaderContainer isLoading={false}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Heading level={1} className={styles.title}>
            Login
          </Heading>

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </LoaderContainer>
    </div>
  );
}

export default LoginPage;
