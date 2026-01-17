#!/bin/bash

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly WORKSPACE_DIR="/workspace"
readonly CONTAINER_IMAGE="node:24-alpine"

docker pull "${CONTAINER_IMAGE}"

docker run \
    --rm \
    -it \
    --network host \
    --entrypoint sh \
    -v "${SCRIPT_DIR}":"${WORKSPACE_DIR}" \
    -w "${WORKSPACE_DIR}" \
    "${CONTAINER_IMAGE}"