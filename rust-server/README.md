# Getting started

## Create project

run `cargo new server --bin`

## Adding dependencies

<https://docs.rs/> is the place for the crates
Add crates with `cargo add [CRATENAME]`

- For example `cargo add axum`

## Running project

Start project with `cargo run`

- Install `cargo watch` for hot reload
- `cargo fmt && cargo clippy -- -D warnings && cargo run'` formats the code and runs the code after every change

**fmt** formats the code

**clippy** is a linter

**run** runs the code
