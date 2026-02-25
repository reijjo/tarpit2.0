import Image from "next/image";

import { Button } from "@/components/ui/button/Button";
import { TextInput } from "@/components/ui/inputs/TextInput";

export default function ForgotPage() {
  return (
    <>
      <div className="form-container">
        <div className="auth-container">
          <form className="auth-form">
            <div className="form-headers">
              <h1>Forgot your password?</h1>
              <h2>No worries!</h2>
            </div>
            <TextInput
              label="email"
              name="email"
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="on"
              className="auth-form-field"
              required
              errors={[]}
            />
            {/* <Button className="auth-btn" type="submit" disabled={isPending}> */}
            <Button className="auth-btn" type="submit">
              {/* {isPending ? "Checking email..." : "Use this email"} */}
              Reset password
            </Button>
          </form>
        </div>
      </div>
      <div className="image-container">
        <Image
          src="/images/login-register/futis-opti.jpg"
          alt="Fudis"
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
