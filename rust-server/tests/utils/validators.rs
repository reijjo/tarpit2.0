use rust_server::utils::validators::{validate_email, validate_password, validate_username};

#[test]
fn validate_email_accepts_valid_addresses() {
    assert!(validate_email("user@example.com").is_ok());
    assert!(validate_email("user.name+tag@example-domain.com").is_ok());
}

#[test]
fn validate_email_rejects_invalid_format() {
    assert!(validate_email("userexample.com").is_err());
    assert!(validate_email("user@invalid").is_err());
}

#[test]
fn validate_username_accepts_allowed_characters() {
    assert!(validate_username("user_name-1.2").is_ok());
}

#[test]
fn validate_username_rejects_disallowed_characters() {
    assert!(validate_username("UserName").is_err());
    assert!(validate_username("user name").is_err());
    assert!(validate_username("user@name").is_err());
}

#[test]
fn validate_password_accepts_strong_password() {
    assert!(validate_password("Strong123!").is_ok());
}

#[test]
fn validate_password_rejects_missing_required_character_classes() {
    assert!(validate_password("lower123!").is_err());
    assert!(validate_password("UPPER123!").is_err());
    assert!(validate_password("NoNumber!").is_err());
    assert!(validate_password("NoSpecial123").is_err());
}
