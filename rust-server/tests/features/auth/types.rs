use rust_server::features::auth::types::RegisterData;
use validator::Validate;

fn valid_input() -> RegisterData {
    RegisterData {
        email: "user@example.com".to_string(),
        username: "user_name".to_string(),
        password: "Strong123!".to_string(),
    }
}

#[test]
fn register_data_accepts_valid_payload() {
    let payload = valid_input();
    assert!(payload.validate().is_ok());
}

#[test]
fn register_data_rejects_invalid_email() {
    let payload = RegisterData {
        email: "invalid-email".to_string(),
        ..valid_input()
    };

    let err = payload
        .validate()
        .expect_err("validation should fail for invalid email");
    assert!(err.field_errors().contains_key("email"));
}

#[test]
fn register_data_rejects_invalid_username() {
    let payload = RegisterData {
        username: "Invalid Username".to_string(),
        ..valid_input()
    };

    let err = payload
        .validate()
        .expect_err("validation should fail for invalid username");
    assert!(err.field_errors().contains_key("username"));
}

#[test]
fn register_data_rejects_weak_password() {
    let payload = RegisterData {
        password: "weakpass".to_string(),
        ..valid_input()
    };

    let err = payload
        .validate()
        .expect_err("validation should fail for weak password");
    assert!(err.field_errors().contains_key("password"));
}
