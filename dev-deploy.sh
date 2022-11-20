#!/bin/bash
set -e

near dev-deploy out/bmt.wasm

CONTRACT_ID=$(<neardev/dev-account)

near create-account bmt."$CONTRACT_ID" --masterAccount "$CONTRACT_ID" --initialBalance 100
near deploy --accountId bmt."$CONTRACT_ID" --wasmFile out/bmt.wasm
