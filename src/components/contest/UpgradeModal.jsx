import React, { useContext, useState } from "react";
import { NearContext } from "../../context/near";
import { Input } from "../Form";
import { Modal } from "../Modal";

export const UpgradeModal = ({ showModal, setShowModal }) => {
  const near = useContext(NearContext);

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(1);

  const handleUpgrade = async () => {
    setLoading(true);
    await near.mainContract.updateLevel(amount);
    setLoading(false);
  };

  return (
    <Modal
      title={"Upgrade Account"}
      showModal={showModal}
      setShowModal={setShowModal}
      onSubmit={handleUpgrade}
      loading={loading}
    >
      <div className="mb-6 w-full h-full flex flex-wrap gap-3 overflow-y-auto">
        <div className="flex flex-col w-full">
          <Input
            id="amount"
            placeholder="Enter NEAR amount"
            val={amount}
            handleChange={setAmount}
          />
          <p className="mt-3">
            You'll receive{" "}
            <span className="text-green-500 font-semibold">
              {amount * 10} XP
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};
