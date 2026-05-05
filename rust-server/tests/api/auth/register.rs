use super::support::{
    build_test_server, build_test_server_without_db, unique_email, unique_username, valid_password,
};
use axum::http::StatusCode;
use serde_json::{Value, json};

// ============================================================================
// SUCCESSFUL REGISTRATION TESTS
// ============================================================================

#[tokio::test]
async fn register_success() {
    let server = build_test_server().await;

    let email = unique_email();
    let username = unique_username();

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email,
            "username": username,
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);

    let body: Value = res.json();
    assert_eq!(body["success"], true);
    assert_eq!(body["message"], "Check your email to validate your account");
}

#[tokio::test]
async fn register_trims_and_lowercases() {
    let server = build_test_server().await;

    let email = unique_email();
    let username = unique_username();

    // Send with uppercase and whitespace
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": format!("  {}  ", email.to_uppercase()),
            "username": format!("  {}  ", username.to_uppercase()),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);

    // Verify the user was created with cleaned data by trying to register again
    // with the same cleaned email - should fail with conflict
    let res2 = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email,
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res2.assert_status(StatusCode::CONFLICT);
}

// ============================================================================
// MISSING FIELD VALIDATION TESTS
// ============================================================================

#[tokio::test]
async fn register_missing_email() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_missing_username() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_missing_password() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_empty_email_after_trim() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": "   ",
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert!(body["error"].as_str().unwrap().contains("Missing fields"));
}

#[tokio::test]
async fn register_empty_username_after_trim() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": "   ",
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert!(body["error"].as_str().unwrap().contains("Missing fields"));
}

#[tokio::test]
async fn register_empty_password_after_trim() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": "   "
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert!(body["error"].as_str().unwrap().contains("Missing fields"));
}

// ============================================================================
// EMAIL VALIDATION TESTS
// ============================================================================

#[tokio::test]
async fn register_invalid_email_format_no_at() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": "invalidemail.com",
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_invalid_email_format_no_domain() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": "invalid@",
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_invalid_email_format_no_tld() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": "invalid@domain",
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

// ============================================================================
// USERNAME VALIDATION TESTS
// ============================================================================

#[tokio::test]
async fn register_username_too_short() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": "ab",
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_username_too_long() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": "a".repeat(21),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_username_invalid_chars_spaces() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": "user name",
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_username_invalid_chars_special() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": "user@name",
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn register_username_valid_chars_dots_dashes_underscores() {
    let server = build_test_server().await;
    let id = uuid::Uuid::new_v4().simple().to_string();
    let username = format!("u.{}-{}_1", &id[..4], &id[4..8]);

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": username,
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);
}

// ============================================================================
// PASSWORD VALIDATION TESTS
// ============================================================================

#[tokio::test]
async fn register_password_too_short() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": "Test1!"
        }))
        .await;

    res.assert_status_bad_request();
}

#[tokio::test]
async fn register_password_too_long() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": format!("Test1!{}", "a".repeat(50))
        }))
        .await;

    res.assert_status_bad_request();
}

#[tokio::test]
async fn register_password_missing_uppercase() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": "test123!@#"
        }))
        .await;

    res.assert_status_bad_request();

    let body: Value = res.json();
    assert!(body["error"].as_str().unwrap().contains("uppercase"));
}

#[tokio::test]
async fn register_password_missing_lowercase() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": "TEST123!@#"
        }))
        .await;

    res.assert_status_bad_request();

    let body: Value = res.json();
    assert!(body["error"].as_str().unwrap().contains("lowercase"));
}

#[tokio::test]
async fn register_password_missing_number() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": "TestTest!@#"
        }))
        .await;

    res.assert_status_bad_request();

    let body: Value = res.json();
    assert!(body["error"].as_str().unwrap().contains("number"));
}

#[tokio::test]
async fn register_password_missing_special_char() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": "Test123456"
        }))
        .await;

    res.assert_status_bad_request();

    let body: Value = res.json();
    assert!(
        body["error"]
            .as_str()
            .unwrap()
            .contains("special character")
    );
}

// ============================================================================
// CONFLICT TESTS
// ============================================================================

#[tokio::test]
async fn register_duplicate_email() {
    let server = build_test_server().await;

    let email = unique_email();
    let username1 = unique_username();
    let username2 = unique_username();

    // First registration
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email,
            "username": username1,
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);

    // Second registration with same email
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email,
            "username": username2,
            "password": valid_password()
        }))
        .await;

    res.assert_status_conflict();

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert!(
        body["error"]
            .as_str()
            .unwrap()
            .contains("Email already in use")
    );
}

#[tokio::test]
async fn register_duplicate_username() {
    let server = build_test_server().await;

    let email1 = unique_email();
    let email2 = unique_email();
    let username = unique_username();

    // First registration
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email1,
            "username": username,
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);

    // Second registration with same username
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email2,
            "username": username,
            "password": valid_password()
        }))
        .await;

    res.assert_status_conflict();

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert!(
        body["error"]
            .as_str()
            .unwrap()
            .contains("Username already in use")
    );
}

// ============================================================================
// JSON PARSING TESTS
// ============================================================================

#[tokio::test]
async fn register_invalid_json() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .content_type("application/json")
        .text("{invalid json}")
        .await;

    res.assert_status_bad_request();

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    let error = body["error"].as_str().unwrap().to_lowercase();
    assert!(error.contains("json") || error.contains("request body"));
}

#[tokio::test]
async fn register_missing_content_type() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .text(r#"{"email":"test@example.com","username":"testuser","password":"Test123!@#"}"#)
        .await;

    res.assert_status_bad_request();

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert!(body["error"].as_str().unwrap().contains("Content-Type"));
}

// ============================================================================
// DATABASE TESTS
// ============================================================================

#[tokio::test]
async fn register_database_unavailable() {
    let server = build_test_server_without_db().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status_internal_server_error();

    let body: Value = res.json();
    assert_eq!(body["success"], false);
}

// ============================================================================
// SECURITY TESTS - SQL INJECTION
// ============================================================================

#[tokio::test]
async fn register_sql_injection_email() {
    let server = build_test_server().await;

    // Common SQL injection payloads
    let sql_payloads = vec![
        "test@example.com' OR '1'='1",
        "test@example.com'; DROP TABLE users; --",
        "test@example.com' UNION SELECT * FROM users --",
        "test@example.com'; INSERT INTO users VALUES ('hacked'); --",
        "admin'--",
        "' OR 1=1 --",
    ];

    for payload in sql_payloads {
        let res = server
            .post("/api/auth/register")
            .json(&json!({
                "email": payload,
                "username": unique_username(),
                "password": valid_password()
            }))
            .await;

        // Should fail validation (invalid email format), not execute SQL
        res.assert_status_bad_request();
    }
}

#[tokio::test]
async fn register_sql_injection_username() {
    let server = build_test_server().await;

    let sql_payloads = vec![
        "admin' OR '1'='1",
        "user'; DROP TABLE users; --",
        "test' UNION SELECT password FROM users --",
        "'; INSERT INTO users VALUES ('hacked'); --",
    ];

    for payload in sql_payloads {
        let res = server
            .post("/api/auth/register")
            .json(&json!({
                "email": unique_email(),
                "username": payload,
                "password": valid_password()
            }))
            .await;

        // Should fail validation (invalid username chars), not execute SQL
        res.assert_status_bad_request();
    }
}

#[tokio::test]
async fn register_sql_injection_password() {
    let server = build_test_server().await;

    // Even if password contains SQL, it should be hashed before storage
    let sql_payloads = vec![
        "Test123!' OR '1'='1",
        "Test123!'; DROP TABLE users; --",
        "Test123!' UNION SELECT * FROM users --",
    ];

    for payload in sql_payloads {
        let res = server
            .post("/api/auth/register")
            .json(&json!({
                "email": unique_email(),
                "username": unique_username(),
                "password": payload
            }))
            .await;

        // These might pass validation but should be safely hashed
        // The important thing is they don't cause SQL errors
        if res.status_code().is_success() {
            // If registration succeeds, verify the password was hashed
            // by checking we can't login with SQL injection
            let body: Value = res.json();
            assert_eq!(body["success"], true);
        }
        // If it fails, it should be due to validation, not SQL error
    }
}

// ============================================================================
// SECURITY TESTS - XSS
// ============================================================================

#[tokio::test]
async fn register_xss_email() {
    let server = build_test_server().await;

    let xss_payloads = vec![
        "<script>alert('xss')</script>@example.com",
        "test@example.com<script>alert('xss')</script>",
        "test@<script>alert('xss')</script>.com",
        "javascript:alert('xss')@example.com",
    ];

    for payload in xss_payloads {
        let res = server
            .post("/api/auth/register")
            .json(&json!({
                "email": payload,
                "username": unique_username(),
                "password": valid_password()
            }))
            .await;

        // Should fail email validation
        res.assert_status_bad_request();
    }
}

#[tokio::test]
async fn register_xss_username() {
    let server = build_test_server().await;

    let xss_payloads = vec![
        "<script>alert('xss')</script>",
        "user<img src=x onerror=alert('xss')>",
        "user\"><script>alert('xss')</script>",
        "userjavascript:alert('xss')",
    ];

    for payload in xss_payloads {
        let res = server
            .post("/api/auth/register")
            .json(&json!({
                "email": unique_email(),
                "username": payload,
                "password": valid_password()
            }))
            .await;

        // Should fail username validation (invalid chars)
        res.assert_status_bad_request();
    }
}

// ============================================================================
// SECURITY TESTS - BUFFER OVERFLOW / LENGTH ATTACKS
// ============================================================================

#[tokio::test]
async fn register_extremely_long_email() {
    let server = build_test_server().await;

    // Create an extremely long email (10,000 chars)
    let long_email = format!("{}@example.com", "a".repeat(9990));

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": long_email,
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    // Should fail validation, not cause buffer overflow
    res.assert_status_bad_request();
}

#[tokio::test]
async fn register_extremely_long_username() {
    let server = build_test_server().await;

    // Create an extremely long username (10,000 chars)
    let long_username = "a".repeat(10000);

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": long_username,
            "password": valid_password()
        }))
        .await;

    // Should fail validation (max 20 chars)
    res.assert_status_bad_request();
}

#[tokio::test]
async fn register_extremely_long_password() {
    let server = build_test_server().await;

    // Create an extremely long password (10,000 chars)
    let long_password = format!("Test1!{}", "a".repeat(9994));

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": unique_username(),
            "password": long_password
        }))
        .await;

    // Should fail validation (max 50 chars)
    res.assert_status_bad_request();
}

// ============================================================================
// SECURITY TESTS - NULL BYTES AND SPECIAL CHARACTERS
// ============================================================================

#[tokio::test]
async fn register_null_bytes_in_email() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": "test\0@example.com",
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    // Should fail validation
    res.assert_status_bad_request();
}

#[tokio::test]
async fn register_null_bytes_in_username() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": "user\0name",
            "password": valid_password()
        }))
        .await;

    // Should fail validation
    res.assert_status_bad_request();
}

#[tokio::test]
async fn register_unicode_edge_cases() {
    let server = build_test_server().await;

    // Test various Unicode edge cases
    let unicode_usernames = vec![
        "user🎉name",       // Emoji
        "user\u{200B}name", // Zero-width space
        "user\u{FEFF}name", // Byte order mark
        "user\u{202E}name", // Right-to-left override
    ];

    for username in unicode_usernames {
        let res = server
            .post("/api/auth/register")
            .json(&json!({
                "email": unique_email(),
                "username": username,
                "password": valid_password()
            }))
            .await;

        // Should fail validation (only a-z, 0-9, ._- allowed)
        res.assert_status_bad_request();
    }
}

// ============================================================================
// SECURITY TESTS - PATH TRAVERSAL
// ============================================================================

#[tokio::test]
async fn register_path_traversal_email() {
    let server = build_test_server().await;

    let path_payloads = vec![
        "../../../etc/passwd@example.com",
        "..\\..\\..\\windows\\system32@example.com",
        "test@example.com/../../../etc/passwd",
    ];

    for payload in path_payloads {
        let res = server
            .post("/api/auth/register")
            .json(&json!({
                "email": payload,
                "username": unique_username(),
                "password": valid_password()
            }))
            .await;

        // Should fail email validation
        res.assert_status_bad_request();
    }
}

// ============================================================================
// SECURITY TESTS - RACE CONDITIONS
// ============================================================================

#[tokio::test]
async fn register_concurrent_same_email() {
    let server = build_test_server().await;

    let email = unique_email();
    let username1 = unique_username();
    let username2 = unique_username();

    // Run two registration attempts concurrently with the same email.
    let email_for_first = email.clone();
    let username_for_first = username1.clone();
    let email_for_second = email.clone();

    let (res1, res2) = tokio::join!(
        async {
            server
                .post("/api/auth/register")
                .json(&json!({
                    "email": email_for_first,
                    "username": username_for_first,
                    "password": valid_password()
                }))
                .await
        },
        async {
            server
                .post("/api/auth/register")
                .json(&json!({
                    "email": email_for_second,
                    "username": username2,
                    "password": valid_password()
                }))
                .await
        }
    );

    // One should succeed, one should fail with conflict
    let mut success_count = 0;
    let mut conflict_count = 0;

    if res1.status_code().is_success() {
        success_count += 1;
    } else if res1.status_code() == StatusCode::CONFLICT {
        conflict_count += 1;
    }

    if res2.status_code().is_success() {
        success_count += 1;
    } else if res2.status_code() == StatusCode::CONFLICT {
        conflict_count += 1;
    }

    // Exactly one should succeed and one should conflict
    assert_eq!(success_count, 1, "Exactly one registration should succeed");
    assert_eq!(
        conflict_count, 1,
        "Exactly one registration should conflict"
    );
}

#[tokio::test]
async fn register_concurrent_same_username() {
    let server = build_test_server().await;

    let email1 = unique_email();
    let email2 = unique_email();
    let username = unique_username();

    // Run two registration attempts concurrently with the same username.
    let email_for_first = email1.clone();
    let username_for_first = username.clone();
    let username_for_second = username.clone();

    let (res1, res2) = tokio::join!(
        async {
            server
                .post("/api/auth/register")
                .json(&json!({
                    "email": email_for_first,
                    "username": username_for_first,
                    "password": valid_password()
                }))
                .await
        },
        async {
            server
                .post("/api/auth/register")
                .json(&json!({
                    "email": email2,
                    "username": username_for_second,
                    "password": valid_password()
                }))
                .await
        }
    );

    // One should succeed, one should fail with conflict
    let mut success_count = 0;
    let mut conflict_count = 0;

    if res1.status_code().is_success() {
        success_count += 1;
    } else if res1.status_code() == 409 {
        conflict_count += 1;
    }

    if res2.status_code().is_success() {
        success_count += 1;
    } else if res2.status_code() == 409 {
        conflict_count += 1;
    }

    // Exactly one should succeed and one should conflict
    assert_eq!(success_count, 1, "Exactly one registration should succeed");
    assert_eq!(
        conflict_count, 1,
        "Exactly one registration should conflict"
    );
}

// ============================================================================
// SECURITY TESTS - INFORMATION LEAKAGE
// ============================================================================

#[tokio::test]
async fn register_error_messages_dont_leak_info() {
    let server = build_test_server().await;

    // Test that error messages don't reveal internal details
    let test_cases = vec![
        (
            json!({
                "email": "invalid",
                "username": unique_username(),
                "password": valid_password()
            }),
            "email validation error",
        ),
        (
            json!({
                "email": unique_email(),
                "username": "ab",
                "password": valid_password()
            }),
            "username validation error",
        ),
        (
            json!({
                "email": unique_email(),
                "username": unique_username(),
                "password": "weak"
            }),
            "password validation error",
        ),
    ];

    for (payload, _description) in test_cases {
        let res = server.post("/api/auth/register").json(&payload).await;

        res.assert_status_bad_request();

        let body: Value = res.json();
        let error_msg = body["error"].as_str().unwrap().to_lowercase();

        // Error messages should not contain:
        // - Database details
        // - Stack traces
        // - Internal paths
        // - SQL queries
        assert!(!error_msg.contains("sql"), "Error should not contain SQL");
        assert!(
            !error_msg.contains("database"),
            "Error should not contain database"
        );
        assert!(
            !error_msg.contains("postgres"),
            "Error should not contain postgres"
        );
        assert!(
            !error_msg.contains("query"),
            "Error should not contain query"
        );
        assert!(
            !error_msg.contains("table"),
            "Error should not contain table"
        );
        assert!(
            !error_msg.contains("column"),
            "Error should not contain column"
        );
        assert!(
            !error_msg.contains("/users/"),
            "Error should not contain paths"
        );
    }
}

// ============================================================================
// EDGE CASES
// ============================================================================

#[tokio::test]
async fn register_email_with_plus_addressing() {
    let server = build_test_server().await;

    // Plus addressing should be valid
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": format!("test+{}@example.com", uuid::Uuid::new_v4().simple()),
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);
}

#[tokio::test]
async fn register_email_case_insensitive_conflict() {
    let server = build_test_server().await;

    let email = unique_email();

    // Register with lowercase
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email.to_lowercase(),
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);

    // Try to register with uppercase - should conflict
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": email.to_uppercase(),
            "username": unique_username(),
            "password": valid_password()
        }))
        .await;

    res.assert_status_conflict();
}

#[tokio::test]
async fn register_username_case_insensitive_conflict() {
    let server = build_test_server().await;

    let username = unique_username();

    // Register with lowercase
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": username.to_lowercase(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::CREATED);

    // Try to register with uppercase - should conflict
    let res = server
        .post("/api/auth/register")
        .json(&json!({
            "email": unique_email(),
            "username": username.to_uppercase(),
            "password": valid_password()
        }))
        .await;

    res.assert_status_conflict();
}

// ============================================================================
// SECURITY REGRESSION TESTS
// ============================================================================

#[tokio::test]
async fn register_rejects_malicious_payloads_without_server_errors() {
    let server = build_test_server().await;

    let cases = [
        json!({
            "email": unique_email(),
            "username": "<script>alert(1)</script>",
            "password": valid_password()
        }),
        json!({
            "email": unique_email(),
            "username": "admin' OR 1=1 --",
            "password": valid_password()
        }),
        json!({
            "email": "test@example.com\r\nBcc:attacker@example.com",
            "username": unique_username(),
            "password": valid_password()
        }),
    ];

    for payload in cases {
        let res = server.post("/api/auth/register").json(&payload).await;

        res.assert_status(StatusCode::BAD_REQUEST);

        let body: Value = res.json();
        assert_eq!(body["success"], false);
    }
}

#[tokio::test]
async fn availability_treats_malicious_inputs_as_literal_values() {
    let server = build_test_server().await;

    let cases = [
        (
            "/api/auth/available?username=%3Cscript%3Ealert(1)%3C%2Fscript%3E",
            "username",
        ),
        (
            "/api/auth/available?username=admin%27%20OR%201%3D1%20--",
            "username",
        ),
        (
            "/api/auth/available?email=test%40example.com%0D%0ABcc%3Aattacker%40example.com",
            "email",
        ),
        (
            "/api/auth/available?email=test%40example.com%26admin%3Dtrue",
            "email",
        ),
    ];

    for (path, field) in cases {
        let res = server.get(path).await;

        res.assert_status(StatusCode::OK);

        let body: Value = res.json();
        assert_eq!(body["success"], true, "unexpected failure for {field}");
        assert_eq!(body["message"], "No duplicates found");
    }
}
