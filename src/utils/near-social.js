if (!props.accountId) {
  return "";
}

const RETRY = 40;
const index = {
  action: "graph",
  key: "nft_stats",
  options: {
    subscribe: true,
    order: "desc",
  },
};

State.init({ nftPair: [], loading: false, tryAgain: false });

const getSample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const fetchCollections = (accountId) =>
  fetch(`https://api.kitwallet.app/account/${accountId}/likelyNFTsFromBlock`);

const profiles = Social.get(["*/profile/name"], "final") || {};
const stats = Social.index("graph", "nft_stats", { order: "desc" });
console.log("", stats);

const getUserNFTContract = (accountId) => {
  const nftResponse = fetchCollections(accountId);
  if (!nftResponse.ok) return;

  const collections = nftResponse.body.list;

  return getSample(collections);
};

const getRandom = (max) => {
  return Math.floor(Math.random() * max);
};

const findUser = (retry) => {
  if (retry === 0) return;

  const profileNames = Object.keys(profiles);
  const accountId = profileNames[getRandom(profileNames.length)];
  const contractId = getUserNFTContract(accountId);

  if (!contractId) return findUser(retry - 1);

  const userNFTs = allNfts(contractId, accountId);
  const nft = getSample(userNFTs);

  if (!nft || !nft.token_id) return findUser(retry - 1);

  return {
    accountId: accountId,
    contractId: contractId,
    nft: nft,
    rating: stats[contractId] ? parseInt(stats[contractId].rating) : 0,
  };
};

const getPair = () => {
  State.update({ loading: true });

  const userNFT1 = findUser(RETRY);
  const userNFT2 = findUser(RETRY);

  State.update({
    nftPair: [userNFT1, userNFT2],
    loading: false,
  });
};

const allNfts = (contractId, accountId) =>
  Near.view(contractId, "nft_tokens_for_owner", {
    account_id: accountId,
    from_index: "0",
    limit: 10,
  });

if (state.loading) return <div>Loading ... </div>;

return (
  <>
    <div className="d-flex gap-1 flex-wrap">
      {state.nftPair.map((obj, i) => (
        <div className="d-block">
          <Widget
            src="mob.near/widget/NftImage"
            props={{
              nft: {
                tokenId: obj.nft.token_id,
                contractId: obj.contractId,
              },
              style: {
                width: "10em",
                height: "10em",
                objectFit: "cover",
                minWidth: "10em",
                minHeight: "10em",
                maxWidth: "10em",
                maxHeight: "10em",
                overflowWrap: "break-word",
              },
              className: "img-thumbnail",
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreihdiy3ec4epkkx7wc4wevssruen6b7f3oep5ylicnpnyyqzayvcry",
              alt: `NFT ${obj.contractId} ${obj.nft.token_id}`,
            }}
          />

          {obj.nft.token_id && (
            <div className="btn-block mt-1">
              <CommitButton
                data={{
                  graph: {
                    nft_stats: {
                      [obj.contractId]: {
                        token_id: obj.nft.token_id,
                        rating: obj.rating + 1,
                      },
                    },
                  },
                  index: {
                    graph: JSON.stringify({
                      key: "nft_stats",
                      value: {
                        nft_stats: {
                          [obj.contractId]: {
                            token_id: obj.nft.token_id,
                            rating: obj.rating + 1,
                          },
                        },
                      },
                    }),
                    notify: JSON.stringify({
                      key: obj.accountId,
                      value: "Congrats! 🎉 your NFT was liked",
                    }),
                  },
                }}
              >
                {`Like (${obj.rating || 0})`}
              </CommitButton>
            </div>
          )}
        </div>
      ))}
    </div>

    <div>
      <div className="btn-block my-2">
        <button onClick={getPair}>Find Random NFT Pair</button>
      </div>
      <h3>Leaderboard</h3>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">NFT contract rating</th>
            <th scope="col">NFT token id</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats)
            .sort((a, b) => parseInt(b[1].rating) - parseInt(a[1].rating))
            .map(([contractId, { token_id, rating }], i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <b>{rating}</b>
                </td>
                <td>
                  <a
                    href={`#mob.near/widget/NftImage?tokenId=${token_id}&contractId=${contractId}`}
                  >
                    {token_id}
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-2">
        <small>
          Follow <a href="https://twitter.com/ContestyNFT">Contesty.app</a>
        </small>
      </div>
    </div>
  </>
);
