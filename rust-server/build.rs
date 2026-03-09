fn main() {
    std::fs::create_dir_all("./migrations").expect("Failed to create migrations directory");

    // Tell Cargo to re-run this script only if migrations folder changes,
    // not on every single build
    println!("cargo:rerun-if-changed=migrations/");
}
