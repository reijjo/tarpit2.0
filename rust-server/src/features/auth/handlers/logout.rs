use axum::extract::State;
use axum_extra::extract::CookieJar;

use crate::{
    features::auth::tokens::cookies::clear_access_cookie, state::AppState,
    utils::api_response::ApiResponse,
};

pub async fn logout_user(State(state): State<AppState>) -> (CookieJar, ApiResponse<()>) {
    let jar = CookieJar::new().add(clear_access_cookie(&state.config));

    (jar, ApiResponse::ok("Logged out", None))
}
