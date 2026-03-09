import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../../../api/auth";
import Heading from "../../../components/heading/Heading";
import LoaderContainer from "../../../components/loaderContainer/LoaderContainer";
import TextInput from "../../../components/formFields/TextInput";

import styles from "./LoginPage.module.css";

function LoginPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    setError("");

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
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Heading level={1} className={styles.title}>
            Login
          </Heading>

          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address.",
              },
            })}
          />

          <TextInput
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required.",
            })}
          />

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
