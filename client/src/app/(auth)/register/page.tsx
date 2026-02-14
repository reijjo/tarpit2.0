import Image from "next/image";

import RegisterEmail from "./_components/RegisterEmail";

export default function RegisterPage() {
  return (
    <>
      <div className="form-container">
        <RegisterEmail />
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
