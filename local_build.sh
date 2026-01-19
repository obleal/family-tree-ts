#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly WORKSPACE_DIR="/workspace"
readonly CONTAINER_IMAGE="node:24-alpine"
readonly CONTAINER_NAME="family-tree"

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Stopping existing container ${CONTAINER_NAME}..."
  docker rm -f "${CONTAINER_NAME}"
fi

docker pull "${CONTAINER_IMAGE}"

clean() {
    echo "🧹 Cleaning..."
    sudo rm -rf "${SCRIPT_DIR}/node_modules"
}

build() {
    docker run \
        --rm \
        -it \
        --name "${CONTAINER_NAME}" \
        --entrypoint sh \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c "echo '🧹 Cleaning...' && \
        rm -rf '${SCRIPT_DIR}/node_modules' && \
        echo '⚙️  Building...' && \
        npm install --silent && \
        echo '✅ Build complete' \
        "
}

run() {
    docker run \
        --rm \
        -it \
        --name "${CONTAINER_NAME}" \
        --entrypoint sh \
        --network host \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c "npm run dev --silent"
}

cli() {
    docker run \
        --rm \
        -it \
        --name "${CONTAINER_NAME}" \
        --entrypoint sh \
        -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
        -w "${WORKSPACE_DIR}" \
        "${CONTAINER_IMAGE}" \
        -c "echo \"🖥️  OS Version: \$(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '\"')\" && \
        sh \
        "
}

usage() {
    echo "Usage: $0 {build|run|clean|cli}"
    exit 1
}

case "${1:-}" in
    build) build ;;
    run)   run ;;
    clean) clean ;;
    cli)   cli;;
    *)     usage ;;
esac
