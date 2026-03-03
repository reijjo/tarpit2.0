use axum::{extract::Request, middleware::Next, response::Response};
use owo_colors::OwoColorize;
use std::time::Instant;

pub async fn log_middleware(req: Request, next: Next) -> Response {
    let method = req.method().clone();
    let path = req.uri().path().to_string();

    let start = Instant::now();
    let response = next.run(req).await;
    let duration = start.elapsed();
    let status = response.status().as_u16();

    let method_colored = match method.as_str() {
        "GET" => method.to_string().green().bold().to_string(),
        "POST" => method.to_string().blue().bold().to_string(),
        "PUT" => method.to_string().yellow().bold().to_string(),
        "DELETE" => method.to_string().red().bold().to_string(),
        "PATCH" => method.to_string().cyan().bold().to_string(),
        _ => method.to_string().white().bold().to_string(),
    };

    let status_colored = match status {
        200..=299 => status.to_string().green().bold().to_string(),
        300..=399 => status.to_string().cyan().bold().to_string(),
        400..=499 => status.to_string().yellow().bold().to_string(),
        _ => status.to_string().red().bold().to_string(),
    };

    let ms = duration.as_millis();
    let duration_colored = if ms >= 500 {
        format!("{}ms", ms).red().to_string()
    } else if ms >= 100 {
        format!("{}ms", ms).yellow().to_string()
    } else {
        format!("{}ms", ms).dimmed().to_string()
    };

    // 🦀 eprintln! writes directly to stderr — bypasses tracing entirely
    // so ANSI codes are passed raw to the terminal and rendered as colors.
    // This is intentional: HTTP access logs are not structured app events.
    // stderr is the correct stream for logs (stdout is for program output).
    eprintln!(
        "{} {} {} {}",
        method_colored, path, status_colored, duration_colored
    );

    response
}
