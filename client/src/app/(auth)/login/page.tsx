import Image from "next/image";

import Login from "./_components/Login";

export default function LoginPage() {
  return (
    <>
      <div className="form-container">
        <Login />
      </div>
      <div className="image-container">
        <Image
          src="/images/login-register/tennis-opti.webp"
          alt="Tennis"
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
