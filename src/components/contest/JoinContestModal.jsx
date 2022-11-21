import React, { useEffect, useState } from "react";
import { convertToTera, convertToYocto } from "../../utils/utils";
import { Input } from "../Form";
import { Modal } from "../Modal";
import { NFTStorage } from "../../../node_modules/nft.storage/dist/bundle.esm.min.js";
import { Skeleton } from "../Skeleton";
import { ImageUploader } from "../ImageUploader";

export const JoinContestModal = ({
  showModal,
  setShowModal,
  currentUser,
  contest,
}) => {
  const [loading, isLoading] = useState(false);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();

  const uploadImage = async () => {
    isLoading(true);
    const NFT_STORAGE_KEY = process.env.IPFS_API_KEY;
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });

    const metadata = await client.store({
      name: "My sweet NFT",
      description: "test",
      image: image,
    });

    setImageUrl(`https://nftstorage.link/ipfs/${metadata.ipnft}`);
    isLoading(false);
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  const joinContest = async () => {
    if (!image || !imageUrl) return;

    await window.contract.join_contest(
      {
        contest_id: contest.id,
        nft_src: imageUrl,
        accountId: currentUser.accountId,
      },
      convertToTera("20"),
      convertToYocto(contest.entry_fee)
    );
  };

  return (
    <Modal
      title={"Join Contest"}
      showModal={showModal}
      setShowModal={setShowModal}
      onSubmit={joinContest}
      loading={loading}
    >
      <div className="block p-6">
        <div className="form-group mb-6">
          {loading ? (
            <Skeleton />
          ) : (
            <ImageUploader selectedFile={image} setSelectedFile={setImage} />
          )}
        </div>
      </div>
    </Modal>
  );
};
