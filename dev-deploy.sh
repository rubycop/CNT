#!/bin/bash
set -e

export CONTRACT_ID=contesty-v2.testnet

near deploy --accountId $CONTRACT_ID --wasmFile out/main.wasm

# near create-account ft.$CONTRACT_ID --masterAccount $CONTRACT_ID --initialBalance 10
# near deploy --accountId ft.$CONTRACT_ID --wasmFile out/ft.wasm

# near create-account burn.$CONTRACT_ID --masterAccount $CONTRACT_ID --initialBalance 10

# near call ft.$CONTRACT_ID new_default_meta '{"owner_id":"'$CONTRACT_ID'", "total_supply": "1000000000000000000000000000000"}' --accountId $CONTRACT_ID

# near call ft.$CONTRACT_ID ft_mint '{"receiver_id": "'burn.$CONTRACT_ID'", "amount": "0"}' --deposit 0.00125  --accountId $CONTRACT_ID

# near call ft.$CONTRACT_ID ft_transfer '{"receiver_id": "rubycoptest.testnet", "amount": "10000000000000000000000000000"}' --depositYocto 1 --accountId $CONTRACT_ID

near view $CONTRACT_ID get_contests '{}'
near view $CONTRACT_ID get_participants '{}'
near view $CONTRACT_ID get_voters '{}'
