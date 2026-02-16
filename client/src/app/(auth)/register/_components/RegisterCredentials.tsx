import "./RegisterEmail.css";
import { registerCredentials } from "@/lib/actions/auth";
import { useActionState } from "react";

import { Button } from "@/components/ui/button/Button";
import { LinkButton } from "@/components/ui/button/LinkButton";
import { TextInput } from "@/components/ui/inputs/TextInput";

type RegisterCredentialsProps = {
  goBack: () => void;
  email: string;
};

export default function RegisterCredentials({
  goBack,
  email,
}: RegisterCredentialsProps) {
  const [formState, formAction, isPending] = useActionState(
    registerCredentials,
    {
      success: false,
    },
  );

  return (
    <div className="register-container">
      <form className="register-form" action={formAction}>
        <div className="form-headers">
          <h1>Finish your account</h1>
          <h2>This is the last step!</h2>
        </div>

        <input type="hidden" name="email" value={email} />

        <TextInput
          label="username"
          name="username"
          id="username"
          autoComplete="on"
          type="text"
          placeholder="Username"
          className="register-form-field"
          required
          errors={formState.errors?.username ?? []}
          defaultValue={formState.username}
        />
        <TextInput
          label="password"
          name="password"
          id="password"
          type="password"
          autoComplete="on"
          placeholder="Password"
          className="register-form-field"
          required
          errors={formState.errors?.password ?? []}
          defaultValue={formState.password}
        />
        <Button className="register-btn" type="submit" disabled={isPending}>
          {isPending ? "Creating User..." : "Register"}
        </Button>
      </form>
      <div className="form-footer">
        <p>Want to check your email address?</p>
        <button type="button" className="login-link" onClick={goBack}>
          Go back
        </button>
      </div>
    </div>
  );
}
