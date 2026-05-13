"use client";

import { registerEmail } from "@/features/auth/actions/register";
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
    <div className="auth-container">
      <form className="auth-form" action={formAction}>
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
          autoComplete="email"
          className="auth-form-field"
          required
          errors={formState.errors?.email ?? []}
          defaultValue={email}
        />

        <Button className="auth-btn" type="submit" disabled={isPending}>
          {isPending ? "Checking email..." : "Use this email"}
        </Button>
      </form>
      <DividerWithText text="or login with" width="min(300px, 100%)" />
      <Button
        variant="outline"
        className="auth-btn"
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
