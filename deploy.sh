#!/bin/bash
set -e

near deploy --accountId $NEAR_ID --wasmFile out/main.wasm
near deploy --accountId ft."$NEAR_ID" --wasmFile out/ft.wasm
