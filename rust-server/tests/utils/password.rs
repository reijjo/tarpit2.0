use rust_server::utils::password::{hash_password, verify_password};

#[test]
fn hash_and_verify_password_roundtrip() {
    let password = "Strong123!";
    let hash = hash_password(password).expect("password hashing should succeed");

    let is_valid = verify_password(password, &hash).expect("password verification should succeed");
    assert!(is_valid);
}

#[test]
fn verify_password_returns_false_for_wrong_password() {
    let hash = hash_password("Strong123!").expect("password hashing should succeed");

    let is_valid =
        verify_password("Wrong123!", &hash).expect("password verification should succeed");
    assert!(!is_valid);
}

#[test]
fn verify_password_returns_error_for_invalid_hash() {
    let result = verify_password("Strong123!", "not-a-valid-argon2-hash");
    assert!(result.is_err());
}
