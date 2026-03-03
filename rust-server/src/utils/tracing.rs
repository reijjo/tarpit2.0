use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

pub fn init_tracing() {
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    //  🦀 try_from_default_env reads the RUST_LOG env var
    //  e.g. RUST_LOG=debug cargo run → shows debug logs
    //  If RUST_LOG is not set, falls back to "info"

    tracing_subscriber::registry()
        .with(env_filter)
        .with(
            tracing_subscriber::fmt::layer()
                .with_level(true) // shows INFO / WARN / ERROR
                .with_target(true) // shows which module logged it e.rust_server::config
                .with_ansi(true) // colors in terminal
                .compact(), // single line per log entry
        )
        .init();
}
