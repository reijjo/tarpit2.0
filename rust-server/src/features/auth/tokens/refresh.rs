#![allow(dead_code)]

use crate::config::Config;
use sha2::{Digest, Sha256};
use uuid::Uuid;

pub fn new_refresh_token() -> String {
    Uuid::new_v4().to_string()
}

pub fn hash_refresh_token(config: &Config, raw_token: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(raw_token.as_bytes());
    hasher.update(config.refresh_token_pepper.as_bytes());
    hex::encode(hasher.finalize())
}
