"use client";
import { loginUser } from "@/lib/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button/Button";
import { DividerWithText } from "@/components/ui/divider/DividerWithText";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { FormErrorMessage } from "@/components/ui/messages/FormErrorMessage";
import { FormSuccessMessage } from "@/components/ui/messages/FormSuccessMessage";

export default function Login() {
  const [formState, formAction, isPending] = useActionState(loginUser, {
    success: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      router.push("/dash");
    }
  }, [formState.success, router]);

  return (
    <div className="auth-container">
      <form className="auth-form" action={formAction}>
        <div className="form-headers">
          <span>
            <h1>Login</h1>
            <Image src="/icons/fishing.png" alt="logo" width={32} height={32} />
          </span>
          <h2>nice to have you here!</h2>
        </div>
        <TextInput
          label="email/username"
          name="login"
          id="login"
          type="text"
          placeholder="Email/Username"
          autoComplete="on"
          className="auth-form-field"
          required
          errors={formState.errors?.login ?? []}
        />
        <TextInput
          label="password"
          name="password"
          id="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          className="auth-form-field"
          required
          errors={formState.errors?.password ?? []}
        />
        {formState.message && (
          <FormSuccessMessage message={formState.message} />
        )}
        {formState.error && <FormErrorMessage message={formState.error} />}

        <Button className="auth-btn" type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
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
        <p>Forgot your password?</p>
        <Link className="login-link" href="/forgot">
          Click here!
        </Link>
      </div>
    </div>
  );
}
