import React, { useEffect, useState } from "react";
import {
  convertToTera,
  convertToYocto,
  mediaURL,
  resizeFileImage,
  uploadMediaToIPFS,
} from "../../utils/utils";
import { Modal } from "../Modal";
import { Skeleton } from "../Skeleton";
import { ImageUploader } from "../ImageUploader";
import { Button } from "../Button";
import { SelectorIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";

export const JoinContestModal = ({
  showModal,
  setShowModal,
  currentUser,
  contest,
}) => {
  const [loading, isLoading] = useState(false);
  const [chosen, setChosen] = useState();
  const [chosenBtn, setChosenBtn] = useState();
  const [nfts, setNFTs] = useState([]);

  const joinContest = async () => {
    if (!chosen) return;

    await window.contract.join_contest(
      {
        contest_id: contest.id,
        nft_src: chosen,
        accountId: currentUser.accountId,
      },
      convertToTera("50"),
      contest.currency_ft ? 1 : convertToYocto(contest.entry_fee)
    );
  };

  const fetchNfts = async () => {
    isLoading(true);
    const userNfts = await window.parasContract.nft_tokens_for_owner({
      account_id: currentUser.accountId,
    });

    if (userNfts) setNFTs(userNfts.map((nft) => nft.metadata.media));
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
              nfts.map((imgUrl, index) => (
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
                    src={mediaURL(imgUrl)}
                  />
                  <div
                    className={`absolute flex w-full h-full top-0 justify-center items-center z-10 down-content ${
                      chosenBtn === index ? "cursor-pointer block" : "hidden"
                    }`}
                  >
                    <Button
                      title="choose"
                      outlined={chosen != mediaURL(imgUrl)}
                      icon={<CheckIcon className="w-5 h-5 ml-3" />}
                      handleClick={() => {
                        if (chosen) {
                          setChosen();
                          setChosenBtn();
                        } else {
                          setChosenBtn(index);
                          setChosen(mediaURL(imgUrl));
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
