"use client";
import "./RegisterEmail.css";
import { registerEmail } from "@/lib/actions/auth";
import { useActionState } from "react";

import { Button } from "@/components/ui/button/Button";
import TextInput from "@/components/ui/inputs/TextInput";

export default function RegisterEmail() {
  const [formState, formAction, isPending] = useActionState(registerEmail, {
    success: false,
  });

  return (
    <form className="register-email-form" action={formAction}>
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
        className="email-field"
        errors={formState.errors?.email ?? []}
      />

      <Button className="register-btn" type="submit" disabled={isPending}>
        {isPending ? "Checking email..." : "Register"}
      </Button>
    </form>
  );
}
