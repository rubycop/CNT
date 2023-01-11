#!/bin/bash
set -e


mkdir -p ../out

cp ./target/wasm32-unknown-unknown/release/main.wasm ../out/main.wasm
cp ./target/wasm32-unknown-unknown/release/ft.wasm ../out/ft.wasm
