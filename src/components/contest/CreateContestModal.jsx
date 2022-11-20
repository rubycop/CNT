import React, { useState } from "react";
import { Input } from "../Form";
import { Modal } from "../Modal";

export const CreateContestModal = ({ showModal, setShowModal }) => {
  const [loading, isLoading] = useState(false);
  const [title, setTitle] = useState();
  const [entryFee, setEntryFee] = useState();
  const [size, setSize] = useState();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleCreate = async () => {
    isLoading(true);
    console.log({
      title: title,
      entry_fee: entryFee.toString(),
      size: size,
      start_time: startTime,
      end_time: endTime,
    });
    await window.contract.create_contest({
      title: title,
      entry_fee: entryFee,
      size: size,
      start_time: startTime,
      end_time: endTime,
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
      <div className="block p-6">
        <div className="form-group mb-6">
          <Input
            placeholder="Contest Title"
            val={title}
            handleChange={setTitle}
          />
        </div>
        <div className="form-group flex mb-6 space-x-4">
          <Input
            placeholder="Number of participants"
            val={size}
            handleChange={setSize}
          />
          <Input
            type="number"
            min={0}
            placeholder="Entry Fee"
            val={entryFee}
            handleChange={setEntryFee}
          />
        </div>
        <div className="form-group mb-6">
          <Input
            type="datetime-local"
            val={startTime}
            handleChange={setStartTime}
          />
          <Input
            type="datetime-local"
            min={startTime}
            val={endTime}
            handleChange={setEndTime}
          />
        </div>
      </div>
    </Modal>
  );
};
