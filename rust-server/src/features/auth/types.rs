use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::utils::validators::{validate_email, validate_password, validate_username};

#[allow(dead_code)]
#[derive(Serialize, Deserialize, Debug, Validate)]
pub struct RegisterData {
    #[validate(custom(function = validate_email))]
    pub email: String,

    #[validate(length(
        min = 3,
        max = 20,
        message = "Username must be between 3 and 20 characters"
    ), custom(function = validate_username))]
    pub username: String,

    #[validate(length(
        min = 8,
        max = 50,
        message = "Password must be between 8 and 50 characters"
    ), custom(function = validate_password))]
    pub password: String,
}
