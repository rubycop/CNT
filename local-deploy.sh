#!/bin/bash
set -e

near dev-deploy out/main.wasm

CONTRACT_ID=$(<neardev/dev-account)

near deploy --accountId $CONTRACT_ID --wasmFile out/main.wasm

near create-account ft.$CONTRACT_ID --masterAccount $CONTRACT_ID --initialBalance 10
near deploy --accountId ft.$CONTRACT_ID --wasmFile out/ft.wasm
near call ft.$CONTRACT_ID new_default_meta '{"owner_id":"'$CONTRACT_ID'", "total_supply": "1000000000000000000000000000000"}' --accountId $CONTRACT_ID
near call $CONTRACT_ID add_token_storage '{"account_id":"ft.'$CONTRACT_ID'"}' --accountId $CONTRACT_ID

#echo "--- Seed Contests Data:"
near call $CONTRACT_ID create_contest '{"currency_ft":false, "title": "Paras Weekly Contest", "size": "3", "entry_fee": "1", "start_time": "1768372926143", "end_time": "1768372936143", "image": "https://ehow.ng/wp-content/uploads/2022/01/How-to-Make-an-NFT-768x432.png"}' --accountId $CONTRACT_ID
near call $CONTRACT_ID create_contest '{"currency_ft":true, "title": "NFT Battle", "size": "10", "entry_fee": "500", "start_time": "1778372926143", "end_time": "1778372956143", "image": "https://ipfs.fleek.co/ipfs/bafybeiet3hpsmufamhtxvfh5uqtnxpshgbrpbhra6wyrykf2ae5kdejami"}' --accountId $CONTRACT_ID

# near call $CONTRACT_ID create_contest '{"currency_ft":false, "title": "NEAR TOP NFTs Contest", "size": "5", "entry_fee": "2", "start_time": "1768372926143", "end_time": "1768372936143", "image": "https://pbs.twimg.com/profile_images/1465377609055825926/eaktYpoA_400x400.jpg"}' --accountId $CONTRACT_ID
# near call $CONTRACT_ID join_contest '{"contest_id": "1671645187002409668", "nft_src": "https://ipfs.fleek.co/ipfs/bafybeiet3hpsmufamhtxvfh5uqtnxpshgbrpbhra6wyrykf2ae5kdejami"}' --accountId rubycoptest.testnet  --gas=300000000000000 