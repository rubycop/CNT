#!/bin/bash
set -e

if [ ${#NEAR_ID} -eq 0 ]
then
 read -p "Enter NEAR_ID: " NEAR_ID
fi

CONTRACT_ID=$(<neardev/dev-account)

# echo "---> Create test contest:"
contest1=$(near call $CONTRACT_ID create_contest '{"title": "Weekly NFT NEAR Battle", "size": "2", "entry_fee": "1", "start_time": 1668372926143, "end_time": 1668373926143}' --accountId $NEAR_ID)
contest2=$(near call $CONTRACT_ID create_contest '{"title": "Paras NFT", "size": "2", "entry_fee": "0.1", "start_time": 1668392926143, "end_time": 1668493926143}' --accountId $NEAR_ID)
contest3=$(near call $CONTRACT_ID create_contest '{"title": "Best Dog contest", "size": "2", "entry_fee": "0.01", "start_time": 1668372926143, "end_time": 1668373926143}' --accountId $NEAR_ID)
