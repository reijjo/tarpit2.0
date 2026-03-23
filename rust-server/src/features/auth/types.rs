use serde::Serialize;
use validator::Validate;

use crate::utils::validators::validate_username;

#[allow(dead_code)]
#[derive(Serialize, Validate)]
pub struct RegisterData {
    #[validate(email(message = "Invalid email"))]
    pub email: String,

    #[validate(length(
        min = 3,
        max = 20,
        message = "Username must be between 3 and 20 characters"
    ), custom(function = validate_username))]
    pub username: String,

    pub password: String,
}
