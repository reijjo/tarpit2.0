import { verifyAccount } from "@/lib/api/auth";

import { Button } from "@/components/ui/button/Button";
import { LinkButton } from "@/components/ui/button/LinkButton";

export default async function VerifyContent({ token }: { token: string }) {
  const res = await verifyAccount(token);

  if (res.success) {
    return (
      <>
        <h1>All good!</h1>
        <p>You can now log in with your email/username</p>
        <LinkButton href="/login">Go to login</LinkButton>
      </>
    );
  }

  return (
    <>
      <h1>Verification failed</h1>
      <p>{res.error}</p>
      {res.status === 410 && <Button>Resend verification email</Button>}
    </>
  );
}
