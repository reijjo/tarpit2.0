"use client";
import "./Register.css";
import { registerEmail } from "@/lib/actions/auth";
import Link from "next/link";
import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button/Button";
import { DividerWithText } from "@/components/ui/divider/DividerWithText";
import { TextInput } from "@/components/ui/inputs/TextInput";

type RegisterEmailProps = {
  email: string;
  onSuccess: (email: string) => void;
};

export default function RegisterEmail({
  email,
  onSuccess,
}: RegisterEmailProps) {
  const [formState, formAction, isPending] = useActionState(registerEmail, {
    success: false,
  });

  useEffect(() => {
    if (formState.success && formState.email) {
      onSuccess(formState.email);
    }
  }, [formState, onSuccess]);

  return (
    <div className="register-container">
      <form className="register-form" action={formAction}>
        <div className="form-headers">
          <h1>Create your account</h1>
          <h2>Start tracking your bets at tärpit</h2>
        </div>
        <TextInput
          label="email"
          name="email"
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="on"
          className="register-form-field"
          required
          errors={formState.errors?.email ?? []}
          defaultValue={email}
        />

        <Button className="register-btn" type="submit" disabled={isPending}>
          {isPending ? "Checking email..." : "Use this email"}
        </Button>
      </form>
      <DividerWithText text="or login with" width="min(300px, 100%)" />
      <Button
        variant="outline"
        className="register-btn"
        disabled
        aria-label="Google login coming soon"
      >
        Google
      </Button>
      <div className="form-footer">
        <p>Already have an account?</p>
        <Link className="login-link" href="/login">
          Log in!
        </Link>
      </div>
    </div>
  );
}
