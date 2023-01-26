import React, { useContext, useEffect, useState } from "react";
import { convertToTera, convertToYocto, mediaURL } from "../../utils/utils";
import { Modal } from "../Modal";
import { Skeleton } from "../Skeleton";
import { Button } from "../Button";
import { CheckIcon } from "@heroicons/react/solid";
import { NearContext } from "../../context/near";

export const JoinContestModal = ({ showModal, setShowModal, contest }) => {
  const near = useContext(NearContext);

  const [loading, isLoading] = useState(false);
  const [chosen, setChosen] = useState();
  const [chosenBtn, setChosenBtn] = useState();
  const [nfts, setNFTs] = useState([]);

  const joinContest = async () => {
    if (!chosen) return;

    if (contest.currency_ft) {
      const txns = [
        {
          signerId: near.wallet.accountId,
          receiverId: near.mainContract.ftContractId,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "ft_transfer",
                args: {
                  receiver_id: `burn.${near.mainContract.contractId}`,
                  amount: convertToYocto(contest.entry_fee),
                },
                gas: convertToTera("90"),
                deposit: 1,
              },
            },
          ],
        },
      ];

      txns.push({
        signerId: near.wallet.accountId,
        receiverId: near.mainContract.contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "callback_join_contest",
              args: {
                contest_id: contest.id,
                nft_src: chosen,
                owner_id: near.wallet.accountId,
              },
              gas: convertToTera("30"),
            },
          },
        ],
      });

      await near.wallet.callMethods(txns);
    } else
      near.mainContract.joinContest(
        {
          contest_id: contest.id,
          nft_src: chosen,
        },
        convertToTera("90"),
        convertToYocto(contest.entry_fee)
      );
  };

  const fetchNfts = async () => {
    isLoading(true);
    const userNfts = await near.mainContract.nftTokensForOwner({
      account_id: near.wallet.accountId,
    });

    if (userNfts)
      setNFTs(
        userNfts.map((nft) => {
          return { token: nft.token_id, src: nft.metadata.media };
        })
      );
    isLoading(false);
  };

  useEffect(() => {
    showModal && fetchNfts();
  }, [showModal]);

  return (
    <Modal
      title={"Choose NFT"}
      showModal={showModal}
      setShowModal={setShowModal}
      onSubmit={joinContest}
      loading={loading}
      collection={nfts}
    >
      <div className="mb-6 w-full h-full flex flex-wrap gap-3 overflow-y-auto">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            {nfts.length > 0 ? (
              nfts.map(({ token, src }, index) => (
                <div
                  key={index}
                  className="w-48 h-48 rounded-2xl item mx-2 relative"
                  onMouseOver={() => !chosen && setChosenBtn(index)}
                  onMouseOut={() => !chosen && setChosenBtn()}
                >
                  <img
                    className={`w-48 h-48 bg-cover rounded-2xl object-cover ${
                      chosenBtn === index && "blur-xs opacity-70"
                    }`}
                    src={mediaURL(src)}
                  />
                  <div
                    className={`absolute flex w-full h-full top-0 justify-center items-center z-10 down-content ${
                      chosenBtn === index ? "cursor-pointer block" : "hidden"
                    }`}
                  >
                    <Button
                      title="choose"
                      outlined={chosen != token}
                      icon={<CheckIcon className="w-5 h-5 ml-3" />}
                      handleClick={() => {
                        if (chosen) {
                          setChosen();
                          setChosenBtn();
                        } else {
                          setChosenBtn(index);
                          setChosen(token);
                        }
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-2xl font-normal text-center leading-relaxed">
                You don't have any NFTs on Paras. <br />
                Visit{" "}
                <a
                  className="text-violet-600 underline"
                  href="https://paras.id/"
                >
                  paras.id
                </a>{" "}
                and buy some
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
