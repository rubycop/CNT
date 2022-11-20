#!/bin/bash
set -e

mkdir -p ./out

cargo build --all --manifest-path contract/Cargo.toml --target wasm32-unknown-unknown --release
cp contract/target/wasm32-unknown-unknown/release/*.wasm ./out/
