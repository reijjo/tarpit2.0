import { registerCredentials } from "@/lib/actions/auth";
import { useActionState } from "react";

import { Button } from "@/components/ui/button/Button";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { FormErrorMessage } from "@/components/ui/messages/FormErrorMessage";
import { FormSuccessMessage } from "@/components/ui/messages/FormSuccessMessage";

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
    <div className="auth-container">
      <form className="auth-form" action={formAction}>
        <div className="form-headers">
          <h1>Finish your account</h1>
          <h2>This is the last step!</h2>
        </div>

        <input type="hidden" name="email" value={email} />

        <TextInput
          label="username"
          name="username"
          id="username"
          autoComplete="username"
          type="text"
          placeholder="Username"
          className="auth-form-field"
          required
          errors={formState.errors?.username ?? []}
          defaultValue={formState.username}
        />
        <TextInput
          label="password"
          name="password"
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          className="auth-form-field"
          required
          errors={formState.errors?.password ?? []}
          defaultValue={formState.password}
        />
        {formState.message && (
          <FormSuccessMessage message={formState.message} />
        )}
        {formState.error && <FormErrorMessage message={formState.error} />}
        <Button
          className="auth-btn"
          type="submit"
          disabled={isPending || formState.success}
        >
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
