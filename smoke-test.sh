#!/usr/bin/env bash
# iot-app-kit smoke test script

###############################################################################
# SAFETY
###############################################################################

# set a safe internal field separator
IFS=$'\n\t'

# run the script from where it is located
cd "$(dirname "${BASH_SOURCE[0]}")" || {
  echo -e "\033[0;31m[ERROR] Failed to run smoke test script from root directory as expected\033[0m" >&2
  exit 1
}

# exit on error, undefined variable reference, or error in a pipeline
set -euo pipefail

###############################################################################
# GLOBALS
###############################################################################

# global flags
DEBUG=false
FORCE=false
NO_TEARDOWN=false

# usage function for help text
usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  -d    Enable debug logging.
  -f    Force execution (skip uncommitted changes check).
  -n    Do NOT run teardown (cleanup) after completion.
  -h    Display this help message.

EOF
}

# parse flags
while getopts "dfnh" opt; do
  case $opt in
    d) DEBUG=true ;;
    f) FORCE=true ;;
    n) NO_TEARDOWN=true ;;
    h)
      usage
      exit 0
      ;;
    *)
      echo -e "\033[0;31m[ERROR] Unknown flag: $opt\033[0m" >&2
      usage
      exit 1
      ;;
  esac
done
# remove all parsed flags from the input
shift "$((OPTIND -1))"

# ANSI color definitions
readonly COLOR_RED="\033[0;31m"
readonly COLOR_GREEN="\033[0;32m"
readonly COLOR_YELLOW="\033[0;33m"
readonly COLOR_BLUE="\033[0;34m"
readonly COLOR_RESET="\033[0m"

# constants
readonly SMOKE_TEST_DIR="testing/smoke-test"
readonly REGISTRY_PORT=4873
readonly REGISTRY_ENDPOINT="http://localhost:${REGISTRY_PORT}"
readonly REGISTRY_TIMEOUT=30 # seconds
readonly REGISTRY_POLL_INTERVAL=1 # seconds
readonly CHANGESET_FILE=".changeset/smoke-test-$(date +%s).md"

# global variable for capturing verdaccio PID when started
VERDACCIO_PID=""

# global variable to track dirty status
DIRTY=false

###############################################################################
# LOGGING
###############################################################################

log_info() {
  printf "[%s] ${COLOR_GREEN}[INFO] %s${COLOR_RESET}\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

log_warn() {
  printf "[%s] ${COLOR_YELLOW}[WARN] %s${COLOR_RESET}\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >&2
}

log_error() {
  printf "[%s] ${COLOR_RED}[ERROR] %s${COLOR_RESET}\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >&2
  exit 1
}

log_debug() {
  if [ "$DEBUG" = true ]; then
    printf "[%s] ${COLOR_BLUE}[DEBUG] %s${COLOR_RESET}\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
  fi
}

###############################################################################
# HELPERS
###############################################################################

# execute command in the smoke-test dir
smoke_test_run_cmd() {
  if [ ! -d "$SMOKE_TEST_DIR" ]; then
    log_error "Smoke test directory: '$SMOKE_TEST_DIR' does not exist."
  fi

  log_debug "Running command in smoke test directory: $*"

  # spawn sub-shell and run command in the smoke-test dir
  if ! (cd "$SMOKE_TEST_DIR" && "$@"); then
    log_error "Command failed to run in smoke test directory: $*"
  fi
}

# when we need a way to wait for the registry server to start before utilizing it
wait_for_registry() {
  local max_attempts=$((REGISTRY_TIMEOUT / REGISTRY_POLL_INTERVAL))
  local attempt=0

  log_debug "Requesting status of ${REGISTRY_ENDPOINT}"

  until curl --silent --fail "${REGISTRY_ENDPOINT}" &>/dev/null; do
    sleep "$REGISTRY_POLL_INTERVAL"
    attempt=$((attempt + 1))

    if [ "$attempt" -ge "$max_attempts" ]; then
      log_error "Local npm registry did not start within ${REGISTRY_TIMEOUT} seconds."
    fi

    log_debug "Registry not ready, attempt $attempt"
  done
}

###############################################################################
# CLEAN UP & PROCESS MANAGEMENT
###############################################################################

kill_local_npm_registry_server() {
  log_debug "Attempting to gracefully terminate Verdaccio processes at ${REGISTRY_ENDPOINT}"

  # if we captured a PID when launching Verdaccio, attempt to shut it down
  if [ -n "$VERDACCIO_PID" ] && kill -0 "$VERDACCIO_PID" 2>/dev/null; then
    log_debug "Sending SIGTERM to captured Verdaccio PID: ${VERDACCIO_PID}"
    kill "$VERDACCIO_PID" 2>/dev/null || true
  fi

  # fallback: find any Verdaccio processes (case-insensitive)
  local pids=$(pgrep -i verdaccio || true)
  if [ -z "$pids" ]; then
    log_debug "No additional Verdaccio processes found."
  else
    for pid in $pids; do
      if kill -0 "$pid" 2>/dev/null; then
        log_debug "Sending SIGTERM to process $pid"
        kill "$pid" 2>/dev/null || true
      fi
    done
  fi

  # wait to give processes the chance to die on their own
  sleep 2

  # force kill any remaining processes
  if [ -n "$pids" ]; then
    for pid in $pids; do
      if kill -0 "$pid" 2>/dev/null; then
        log_debug "Process $pid still running; sending SIGKILL"
        kill -9 "$pid" 2>/dev/null || true
      fi
    done
  fi
}

revert_local_changes() {
  log_debug "Reverting local changes made during smoke test"
  git restore . || log_warn "git restore failed"
}

sanitize_local_env() {
  log_debug "Sanitizing local development environment"
  log_debug "Deleting all untracked changes"
  git clean -fxd &>/dev/null

  if [ -d ~/.local/share/verdaccio/storage ]; then
    log_debug "Deleting remaining Verdaccio artifacts"
    rm -rf ~/.local/share/verdaccio/storage
  fi
}

teardown() {
  # temporarily disable exit-on-error to ensure all cleanup commands run
  set +e

  if [ "$DIRTY" = false ]; then
    log_debug "Environment is clean; skipping teardown."
    return 0
  fi

  if [ "$NO_TEARDOWN" = true ]; then
    log_debug "NO_TEARDOWN flag set; skipping teardown."
    return 0
  fi

  log_info "Running teardown"
  kill_local_npm_registry_server
  revert_local_changes
  sanitize_local_env

  # re-enable exit-on-error
  set -e
}

# ensure teardown runs on exit or interruption
trap teardown INT EXIT SIGTERM

###############################################################################
# PRE-CHECKS
###############################################################################

check_for_local_changes() {
  log_debug "Checking for uncommitted local changes..."
  if [ "$FORCE" = false ]; then
    if ! git diff --cached --quiet || ! git diff --quiet; then
      log_error "Uncommitted changes detected; commit or use -f to force."
    fi
  else
    log_warn "FORCE flag enabled; skipping uncommitted changes check."
  fi
}

# check for existence of required command
check_for_package() {
  log_debug "Checking if $1 is installed..."
  if ! command -v "$1" &>/dev/null; then
    log_error "Required command: '$1' is not installed or in PATH."
  fi
}

check_for_playwright() {
  log_debug "Checking if Playwright is installed..."
  if ! smoke_test_run_cmd npx --yes playwright install --with-deps --only-shell &>/dev/null; then
    log_error "Playwright is not installed or cannot be installed."
  fi
}

check_for_dependencies() {
  log_debug "Checking for required dependencies..."
  check_for_package npm
  check_for_package npx
  check_for_package git
  check_for_package curl
  check_for_package pgrep
  check_for_playwright
}

###############################################################################
# MAIN SCRIPT
###############################################################################

log_info "Starting smoke test"
check_for_local_changes

log_info "Cleaning local environment"
sanitize_local_env

log_info "Checking for required dependencies"
check_for_dependencies

DIRTY=true
log_debug "Environment is now considered dirty and will be sanitized on teardown."

log_info "Installing workspace dependencies"
# capture output of npm ci for easier debugging
if ! npm ci --prefer-offline --no-audit --progress=false --workspaces --include-workspace-root; then
  log_error "Failed to install workspace dependencies."
fi

log_info "Building dashboard and its dependent packages"
if ! npx --yes turbo run build --filter=@iot-app-kit/dashboard; then
  log_error "Failed to build dashboard and its dependent packages."
fi

log_info "Starting local npm registry server on port ${REGISTRY_PORT}"
# launch verdaccio in the background
npx --yes verdaccio --listen "${REGISTRY_PORT}" &
VERDACCIO_PID=$!
sleep 2 # give verdaccio a moment to start
if ! kill -0 "$VERDACCIO_PID" &>/dev/null; then
  log_error "Verdaccio failed to start."
fi
log_debug "Verdaccio PID: ${VERDACCIO_PID}"

log_info "Waiting for local npm registry to be ready at ${REGISTRY_ENDPOINT}"
wait_for_registry

log_info "Setting npm registry to ${REGISTRY_ENDPOINT}"
if ! npm config set registry "${REGISTRY_ENDPOINT}" --location=project; then
  log_error "Failed to set registry ${REGISTRY_ENDPOINT}"
fi

log_info "Authenticating into local npm registry with dummy credentials"
if ! npx --yes npm-cli-login -u test -p 1234 -e test@domain.test -r "${REGISTRY_ENDPOINT}"; then
  log_error "Authentication into local npm registry failed."
fi

log_info "Bumping package versions"
log_debug "Initializing changesets dependency"
if ! npx --yes changeset init; then
  log_error "Changeset initialization failed."
fi

log_debug "Creating ephemeral patch changeset: ${CHANGESET_FILE}"
{
  echo "---"
  echo "'@iot-app-kit/core': patch"
  echo "'@iot-app-kit/core-util': patch"
  echo "'@iot-app-kit/dashboard': patch"
  echo "'@iot-app-kit/react-components': patch"
  echo "'@iot-app-kit/source-iotsitewise': patch"
  echo "'@iot-app-kit/source-iottwinmaker': patch"
  echo "---"
  echo ""
  echo "Smoke test patch bump."
} > "${CHANGESET_FILE}"

log_debug "Performing patch version bump"
if ! npx --yes changeset version; then
  log_error "Changeset version bump failed."
fi

log_info "Publishing packages to local npm registry: ${REGISTRY_ENDPOINT}"
if ! npm publish -w @iot-app-kit/core \
                 -w @iot-app-kit/core-util \
                 -w @iot-app-kit/dashboard \
                 -w @iot-app-kit/react-components \
                 -w @iot-app-kit/source-iotsitewise \
                 -w @iot-app-kit/source-iottwinmaker; then
  log_error "Failed to publish packages."
fi

log_info "Bumping dashboard version in smoke-test"
DASHBOARD_VERSION=$(cd packages/dashboard && npm pkg get version --workspaces=false | tr -d '"')
if [ -z "$DASHBOARD_VERSION" ]; then
  log_error "Failed to extract dashboard version."
fi
smoke_test_run_cmd npm pkg set dependencies.@iot-app-kit/dashboard="${DASHBOARD_VERSION}"

log_info "Validating installation"
if ! smoke_test_run_cmd npm install --registry="${REGISTRY_ENDPOINT}"; then
  log_error "Installation validation failed."
fi

log_info "Validating re-installation"
if ! smoke_test_run_cmd npm install --registry="${REGISTRY_ENDPOINT}"; then
  log_error "Re-installation validation failed."
fi

log_info "Validating bundling"
if ! smoke_test_run_cmd npm run validate:bundling; then
  log_error "Bundling validation failed."
fi

log_info "Validating runtime"
if ! smoke_test_run_cmd npm run validate:runtime; then
  log_error "Runtime validation failed."
fi

log_info "Smoke test completed successfully."
