"use client";
import Image from "next/image";
import { useState } from "react";

import RegisterCredentials from "./_components/RegisterCredentials";
import RegisterEmail from "./_components/RegisterEmail";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");

  const handleEmailSuccess = (email: string) => {
    setEmail(email);
    setStep(2);
  };

  return (
    <>
      <div className="form-container">
        {step === 1 && (
          <RegisterEmail email={email} onSuccess={handleEmailSuccess} />
        )}
        {step === 2 && <RegisterCredentials goBack={() => setStep(1)} />}
      </div>
      <div className="image-container">
        <Image
          src={
            step === 1
              ? "/images/login-register/penkit-opti.webp"
              : "/images/login-register/tennis-opti.webp"
          }
          alt={step === 1 ? "Penkit" : "Tennis"}
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
