#!/usr/bin/env bash
set -euo pipefail

docker compose -f compose.yml down -v --remove-orphans
