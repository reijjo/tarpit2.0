use tower_http::cors::CorsLayer;

pub fn build_cors(frontend_url: &str) -> Result<CorsLayer, String> {
    use axum::http::{HeaderValue, Method, header};

    let origin: HeaderValue = frontend_url
        .parse()
        .map_err(|_| format!("Invalid FRONTEND_URL '{frontend_url}'"))?;

    Ok(CorsLayer::new()
        .allow_origin(origin)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
        ])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
        .allow_credentials(true))
}
