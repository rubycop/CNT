import React, { useEffect, useState } from "react";
import {
  convertToTera,
  convertToYocto,
  resizeFileImage,
  uploadMediaToIPFS,
} from "../../utils/utils";
import { Modal } from "../Modal";
import { Skeleton } from "../Skeleton";
import { ImageUploader } from "../ImageUploader";

export const JoinContestModal = ({
  showModal,
  setShowModal,
  currentUser,
  contest,
}) => {
  const [loading, isLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [image, setImage] = useState();

  const uploadImage = async (e) => {
    isLoading(true);

    const blobData = await resizeFileImage(image, 600, 800);
    const resultImg = await uploadMediaToIPFS(blobData);
    console.log(`https://ipfs.io/ipfs/${resultImg}`);
    if (resultImg) setImageUrl(`https://ipfs.io/ipfs/${resultImg}`);

    isLoading(false);
  };

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

  useEffect(() => {
    if (image) uploadImage();
  }, [image]);

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
