"use client";
import "./ResendButton.css";
import { resendVerificationEmailAction } from "@/features/auth/actions/register";
import { useActionState } from "react";

import { Button } from "@/components/ui/button/Button";
import { FormErrorMessage } from "@/components/ui/messages/FormErrorMessage";
import { FormSuccessMessage } from "@/components/ui/messages/FormSuccessMessage";

export default function ResendButton({ token }: { token: string }) {
  const [formState, formAction, isPending] = useActionState(
    resendVerificationEmailAction,
    {
      success: false,
    },
  );

  return (
    <form action={formAction} className="resend-container">
      <input type="hidden" name="token" value={token} />

      {formState.success && (
        <FormSuccessMessage
          message={formState.message ?? "Check your email."}
        />
      )}
      {!formState.success && formState.error && (
        <FormErrorMessage message={formState.error} />
      )}

      {!formState.success && (
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Resend verification email"}
        </Button>
      )}
    </form>
  );
}
