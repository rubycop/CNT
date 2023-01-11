#!/bin/bash
set -e

near dev-deploy out/main.wasm

CONTRACT_ID=$(<neardev/dev-account)

near deploy --accountId $CONTRACT_ID --wasmFile out/main.wasm
near create-account ft.$CONTRACT_ID --masterAccount $CONTRACT_ID --initialBalance 10
near deploy --accountId ft.$CONTRACT_ID --wasmFile out/ft.wasm
near create-account burn.$CONTRACT_ID --masterAccount $CONTRACT_ID --initialBalance 1
near call ft.$CONTRACT_ID new_default_meta '{"owner_id":"'$CONTRACT_ID'", "total_supply": "1000000000000000000000000000000"}' --accountId $CONTRACT_ID

#echo "--- Seed Contests Data:"
cnt1=$(near call $CONTRACT_ID create_contest '{"currency_ft":false, "title": "Paras Weekly Contest", "size": "3", "entry_fee": "1", "start_time": "1768372926143", "end_time": "1768372936143", "image": "https://ehow.ng/wp-content/uploads/2022/01/How-to-Make-an-NFT-768x432.png"}' --accountId $CONTRACT_ID)
cnt2=$(near call $CONTRACT_ID create_contest '{"currency_ft":true, "title": "NFT Battle", "size": "10", "entry_fee": "500", "start_time": "1778372926143", "end_time": "1778372956143", "image": "https://ipfs.fleek.co/ipfs/bafybeiet3hpsmufamhtxvfh5uqtnxpshgbrpbhra6wyrykf2ae5kdejami"}' --accountId $CONTRACT_ID)
cnt3=$(near call $CONTRACT_ID create_contest '{"currency_ft":false, "title": "NEAR TOP NFTs Contest", "size": "5", "entry_fee": "2", "start_time": "1768372926143", "end_time": "1768372936143", "image": "https://pbs.twimg.com/profile_images/1465377609055825926/eaktYpoA_400x400.jpg"}' --accountId $CONTRACT_ID)
cnt4=$(near call $CONTRACT_ID create_contest '{"currency_ft":false, "title": "Daily Contest", "size": "5", "entry_fee": "2", "start_time": "1768372926143", "end_time": "1768372936143", "image": "https://media.tatler.com/photos/627258d0bc4f55bd13591609/1:1/w_1280,h_1280,c_limit/Creepz_04052022_Instagram%20@coldbloodedcreepz_nft.jpg"}' --accountId $CONTRACT_ID)
cnt5=$(near call $CONTRACT_ID create_contest '{"currency_ft":false, "title": "Best NFT on 2023", "size": "3", "entry_fee": "15", "start_time": "1778372926143", "end_time": "1778372956143", "image": "https://cdn.dribbble.com/users/383277/screenshots/18055765/media/e5fc935b60035305099554810357012a.png"}' --accountId $CONTRACT_ID)

cnt1=$(awk 'END { print substr( $0, 2, length($0)-2 ) }' <<<"$cnt1")
cnt2=$(awk 'END { print substr( $0, 2, length($0)-2 ) }' <<<"$cnt2")
cnt3=$(awk 'END { print substr( $0, 2, length($0)-2 ) }' <<<"$cnt3")

part1=$(near call $CONTRACT_ID join_contest '{"contest_id": "'$cnt1'", "nft_src": "https://ipfs.fleek.co/ipfs/bafybeiet3hpsmufamhtxvfh5uqtnxpshgbrpbhra6wyrykf2ae5kdejami"}' --amount 1 --accountId rubycoptest.testnet  --gas=300000000000000)
part2=$(near call $CONTRACT_ID join_contest '{"contest_id": "'$cnt1'", "nft_src": "https://ipfs.fleek.co/ipfs/bafybeiet3hpsmufamhtxvfh5uqtnxpshgbrpbhra6wyrykf2ae5kdejami"}' --amount 1 --accountId rubycoptest.testnet  --gas=300000000000000)
part11=$(near call $CONTRACT_ID join_contest '{"contest_id": "'$cnt2'", "nft_src": "https://ipfs.fleek.co/ipfs/bafybeiet3hpsmufamhtxvfh5uqtnxpshgbrpbhra6wyrykf2ae5kdejami"}' --accountId rubycoptest.testnet  --gas=300000000000000)

part1=$(awk 'END { print substr( $0, 2, length($0)-2 ) }' <<<"$part1")
part11=$(awk 'END { print substr( $0, 2, length($0)-2 ) }' <<<"$part11")
part2=$(awk 'END { print substr( $0, 2, length($0)-2 ) }' <<<"$part2")

near call $CONTRACT_ID vote '{"contest_id": "'$cnt1'", "participant_id": "'$part1'"}' --accountId rubycoptest.testnet
near call $CONTRACT_ID vote '{"contest_id": "'$cnt1'", "participant_id": "'$part1'"}' --accountId rubycoptest.testnet
near call $CONTRACT_ID vote '{"contest_id": "'$cnt1'", "participant_id": "'$part11'"}' --accountId rubycoptest.testnet

near call $CONTRACT_ID set_winner '{"contest_id": "'$cnt1'"}' --amount 1 
--accountId rubycoptest.testnet

near view $CONTRACT_ID get_contests '{}'
near view $CONTRACT_ID get_participants '{}'
near view $CONTRACT_ID get_voters '{}'