import VerifyContent from "./VerifyContent";
import { Suspense } from "react";

type VerifyPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const token = params.token?.trim();

  return (
    <div className="auth-verify">
      <div className="container">
        <Suspense fallback={<p>Verifying account...</p>}>
          <VerifyContent token={token ?? ""} />
        </Suspense>
      </div>
    </div>
  );
}
