"use client";
import Image from "next/image";
import { useState } from "react";

import RegisterCredentials from "./_components/RegisterCredentials";
import RegisterEmail from "./_components/RegisterEmail";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");

  const handleEmailSuccess = (validatedEmail: string) => {
    setEmail(validatedEmail);
    setStep(2);
  };

  return (
    <>
      <div className="form-container">
        {step === 1 ? (
          <RegisterEmail email={email} onSuccess={handleEmailSuccess} />
        ) : (
          <RegisterCredentials email={email} goBack={() => setStep(1)} />
        )}
      </div>
      <div className="image-container">
        <Image
          src="/images/login-register/penkit-opti.webp"
          alt="Penkit"
          fill
          sizes="50vw"
          priority
          style={{
            objectFit: "cover",
          }}
        />
      </div>
    </>
  );
}
