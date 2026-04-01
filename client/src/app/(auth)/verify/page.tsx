"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // TODO: Implement actual verification logic by sending the token to the server for validation

  console.log("token:", token);
  return (
    <div className="auth-verify">
      <div className="container">
        <h1>Verify your email</h1>
        <p>
          A verification link has been sent to your email. Please check your
          inbox and click the link to verify your account.
        </p>
      </div>
    </div>
  );
}
