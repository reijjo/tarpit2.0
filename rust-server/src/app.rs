use crate::middleware::logger::log_middleware;
use crate::state::AppState;
use axum::Router;
use tower_http::cors::CorsLayer;

pub fn create_app(state: AppState) -> Router {
    crate::features::routes()
        .layer(build_cors(&state.config.frontend_url))
        .layer(axum::middleware::from_fn(log_middleware))
        .with_state(state)
}

fn build_cors(frontend_url: &str) -> CorsLayer {
    use axum::http::{HeaderValue, Method, header};

    let origin: HeaderValue = frontend_url
        .parse()
        .expect("FRONTEND_URL is not a valid HTTP origin");

    CorsLayer::new()
        .allow_origin(origin)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
        ])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
        .allow_credentials(true)
}
