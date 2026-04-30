#![allow(dead_code)]
use crate::config::{AppEnv, Config};
use axum_extra::extract::cookie::{Cookie, SameSite};
use time::Duration;

pub const ACCESS_COOKIE: &str = "access_token";
pub const REFRESH_COOKIE: &str = "refresh_token";

fn is_secure(env: &AppEnv) -> bool {
    matches!(env, AppEnv::Production)
}

fn build_cookie(
    config: &Config,
    name: &'static str,
    value: String,
    max_age_seconds: i64,
) -> Cookie<'static> {
    Cookie::build((name, value))
        .http_only(true)
        .secure(is_secure(&config.app_env))
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(Duration::seconds(max_age_seconds))
        .build()
}

pub fn access_cookie(config: &Config, token: String) -> Cookie<'static> {
    build_cookie(config, ACCESS_COOKIE, token, config.jwt_access_ttl_seconds)
}

pub fn refresh_cookie(config: &Config, token: String) -> Cookie<'static> {
    build_cookie(config, REFRESH_COOKIE, token, config.refresh_ttl_seconds)
}

pub fn clear_access_cookie(config: &Config) -> Cookie<'static> {
    build_cookie(config, ACCESS_COOKIE, String::new(), 0)
}

pub fn clear_refresh_cookie(config: &Config) -> Cookie<'static> {
    build_cookie(config, REFRESH_COOKIE, String::new(), 0)
}
