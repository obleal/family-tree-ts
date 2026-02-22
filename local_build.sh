#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly WORKSPACE_DIR="/workspace"
readonly CONTAINER_IMAGE="node:24-alpine"

docker pull "${CONTAINER_IMAGE}"

clean() {
    echo "🧹 Cleaning..."
    sudo rm -rf "${SCRIPT_DIR}/node_modules"
    sudo rm -rf "${SCRIPT_DIR}/dist"
}

build() {
    docker run \
        --rm \
        -it \
        --entrypoint sh \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c " \
        echo '🧹 Cleaning...' && \
        rm -rf '${SCRIPT_DIR}/node_modules' && \
        rm -rf '${SCRIPT_DIR}/dist' && \
        echo '⚙️  Building...' && \
        npm ci --silent && \
        echo '✅ Build complete' \
        "
}

run() {
    docker run \
        --rm \
        -it \
        --entrypoint sh \
        --network host \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c " \
        echo '🚀 Running dev server...' && \
        npm run dev --silent"
}

deploy() {
    docker run \
        --rm \
        -it \
        --entrypoint sh \
        --network host \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c " \
        apk add --no-cache --quiet git && \
        git config --global --add safe.directory /workspace &&
        npm run deploy --silent"
}

cli() {
    docker run \
        --rm \
        -it \
        --entrypoint sh \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c " \
        echo \"🖥️  OS Version: \$(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '\"')\" && \
        echo \"📦 Node Version: \$(node -v)\" && \
        sh \
        "
}

usage() {
    echo "Usage: $0 {build|run|deploy|clean|cli}"
    exit 1
}

case "${1:-}" in
    build) build ;;
    run)   run ;;
    deploy) deploy ;;
    clean) clean ;;
    cli)   cli;;
    *)     usage ;;
esac
