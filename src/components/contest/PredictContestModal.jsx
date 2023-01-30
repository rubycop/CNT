import React, { useContext, useEffect, useState } from "react";
import { convertToTera, convertToYocto, mediaURL } from "../../utils/utils";
import { Modal } from "../Modal";
import { NearContext } from "../../context/near";
import { Input } from "../Form";

export const PredictContestModal = ({
  showModal,
  setShowModal,
  participantId,
}) => {
  const near = useContext(NearContext);

  const [loading, isLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const predictContest = async () => {
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
                receiver_id: near.mainContract.contractId,
                amount: convertToYocto(amount),
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
            methodName: "callback_predict_contest",
            args: {
              participant_id: participantId,
              amount: amount.toString(),
              owner_id: near.wallet.accountId,
            },
            gas: convertToTera("30"),
          },
        },
      ],
    });

    await near.wallet.callMethods(txns);
  };

  return (
    <Modal
      title={"Stake CNT"}
      showModal={showModal}
      setShowModal={setShowModal}
      onSubmit={predictContest}
      loading={loading}
    >
      <div className="mb-6 w-full h-full flex flex-wrap gap-3 overflow-y-auto">
        <div className="flex flex-col w-full">
          <Input
            id="amount"
            placeholder="Enter CNT amount"
            val={amount}
            handleChange={setAmount}
          />
        </div>
      </div>
    </Modal>
  );
};
