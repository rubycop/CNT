import { PlusIcon } from "@heroicons/react/solid";
import React, { useContext, useState } from "react";
import { NearContext } from "../../context/near";
import { DatePicker, Input, Select } from "../Form";
import { Modal } from "../Modal";

export const CreateContestModal = ({ showModal, setShowModal }) => {
  const near = useContext(NearContext);

  const [loading, isLoading] = useState(false);
  const [title, setTitle] = useState();
  const [entryFee, setEntryFee] = useState(0);
  const [size, setSize] = useState(2);
  const [currencyFt, setCurrencyFt] = useState(true);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const uploadPhoto = () => {
    console.log(image);
  };

  const handleCreate = async () => {
    isLoading(true);
    await near.mainContract.createContest({
      title: title,
      entry_fee: entryFee,
      size: size,
      currency_ft: currencyFt,
      start_time: startTime,
      end_time: endTime,
      image: "", // temp  solution
    });
    setShowModal(false);
    isLoading(false);
  };

  return (
    <Modal
      title={"Create Contest"}
      showModal={showModal}
      setShowModal={setShowModal}
      onSubmit={handleCreate}
      loading={loading}
    >
      <div className="flex flex-col lg:flex-row gap-3 p-6">
        <div
          onClick={uploadPhoto}
          className="flex justify-center items-center w-48 h-48 rounded-xl bg-violet-200/20 hover:bg-violet-300/10 cursor-pointer
           border border-dashed border-violet-300/50"
        >
          <div className="flex flex-col justify-center items-center text-center">
            <PlusIcon className="w-20 h-20" />
            <div className="mt-2 text-xs">
              Click to
              <br /> upload photo
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="mb-3">
            <Input
              id="contest_title"
              placeholder="Contest Title"
              val={title}
              handleChange={setTitle}
            />
          </div>
          <div className="mb-3">
            <Input
              placeholder="Number of participants"
              type="number"
              min={2}
              val={size}
              handleChange={setSize}
            />
          </div>
          <div className="flex gap-4">
            <Input
              type="number"
              min={0}
              placeholder="Entry Fee"
              val={entryFee}
              handleChange={setEntryFee}
            />
            <Select
              id="currency"
              placeholder="Select currency"
              handleChange={setCurrencyFt}
              options={[
                { label: "CNT", value: true },
                { label: "NEAR", value: false },
              ]}
            />
          </div>
          <div className="flex gap-4 w-full mb-3">
            {/* <DatePicker placeholder="Start Date" />
            <DatePicker placeholder="End Date" /> */}
          </div>
        </div>
      </div>
    </Modal>
  );
};
