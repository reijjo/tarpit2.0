type RegisterCredentialsProps = {
  goBack: () => void;
};

export default function RegisterCredentials({
  goBack,
}: RegisterCredentialsProps) {
  return (
    <div className="register-container">
      <form className="register-email-form">
        <div className="form-headers">
          <h1>Finish your account</h1>
          <h2>This is the last step!</h2>
        </div>
      </form>
      <div className="form-footer">
        <a className="login-link" onClick={goBack}>
          Go back?
        </a>
      </div>
    </div>
  );
}
