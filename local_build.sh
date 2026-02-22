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
    readonly GITHUB_READ_ONLY_TOKEN="$(pass GITHUB/READ_ONLY_TOKEN)"
    readonly GIT_USER_NAME="$(git config --global user.name)"
    readonly GIT_USER_EMAIL="$(git config --global user.email)"
    docker run \
        --rm \
        -it \
        --entrypoint sh \
        --network host \
        -e GIT_USER_NAME="$GIT_USER_NAME" \
        -e GIT_USER_EMAIL="$GIT_USER_EMAIL" \
        -e GITHUB_READ_ONLY_TOKEN="$(pass GITHUB/READ_ONLY_TOKEN)" \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c " \
        apk add --no-cache --quiet git && \
        git config --global user.name \"\$GIT_USER_NAME\" && \
        git config --global user.email \"\$GIT_USER_EMAIL\" && \
        git config --global --add safe.directory /workspace &&
        npm run deploy --silent -- --repo=https://obleal:\$GITHUB_READ_ONLY_TOKEN@github.com/obleal/family-tree-ts.git"
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
