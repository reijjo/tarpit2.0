use serde::{Deserialize, Serialize};
use validator::Validate;

// ---------------
// --- Add bet ---
// ---------------
#[allow(dead_code)]
#[derive(Serialize, Deserialize, Debug, Validate)]
pub struct BetDetailsData {}

#[allow(dead_code)]
#[derive(Serialize, Deserialize, Debug, Validate)]
pub struct BetData {}
