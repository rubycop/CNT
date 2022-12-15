#!/bin/bash
set -e

RUSTFLAGS='-C link-arg=-s' cargo build --all --target wasm32-unknown-unknown --release
mkdir -p ../out

cp ./target/wasm32-unknown-unknown/release/main.wasm ../out/main.wasm
cp ./target/wasm32-unknown-unknown/release/ft.wasm ../out/ft.wasm
