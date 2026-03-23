#![allow(dead_code)]
use std::sync::LazyLock;

use regex::Regex;
use validator::ValidationError;

static USERNAME_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^[a-z0-9_.\-]+$").unwrap());
static UPPERCASE_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[A-Z]").unwrap());
static LOWERCASE_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[a-z]").unwrap());
static NUMBER_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[0-9]").unwrap());
static SPECIALCHAR_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"[!@#$%&*_+\-=.?]").unwrap());

pub fn validate_username(username: &str) -> Result<(), ValidationError> {
    if !USERNAME_REGEX.is_match(username) {
        return Err(ValidationError::new(
            "Only numbers, letters, and ._- allowed",
        ));
    }
    Ok(())
}

pub fn validate_password(password: &str) -> Result<(), ValidationError> {
    if !UPPERCASE_REGEX.is_match(password) {
        return Err(ValidationError::new("Must contain one uppercase letter"));
    }

    if !LOWERCASE_REGEX.is_match(password) {
        return Err(ValidationError::new("Must contain one lowercase letter"));
    }

    if !NUMBER_REGEX.is_match(password) {
        return Err(ValidationError::new("Must contain one number"));
    }

    if !SPECIALCHAR_REGEX.is_match(password) {
        return Err(ValidationError::new(
            "Must contain one special character (!@#$%&*_+-=.?)",
        ));
    }

    Ok(())
}
