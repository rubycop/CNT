import { PlusIcon } from "@heroicons/react/solid";
import React, { useContext, useState } from "react";
import { NearContext } from "../../context/near";
import { NotificationContext } from "../../context/notification";
import {
  dateInSeconds,
  mediaURL,
  resizeFileImage,
  uploadMediaToIPFS,
} from "../../utils/utils";
import { DatePicker } from "../Datepicker";
import { Input, Select } from "../Form";
import { Modal } from "../Modal";

export const CreateContestModal = ({ showModal, setShowModal }) => {
  const near = useContext(NearContext);
  const {
    setShowNotification,
    setNotificationText,
    setNotificationDescription,
  } = useContext(NotificationContext);

  const [loading, isLoading] = useState(false);
  const [title, setTitle] = useState();
  const [entryFee, setEntryFee] = useState(0);
  const [size, setSize] = useState(2);
  const [currencyFt, setCurrencyFt] = useState(true);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [image, setImage] = useState({ preview: null, raw: null });

  const uploadPhoto = (e) => {
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0],
    });
  };

  const handleCreate = async () => {
    isLoading(true);
    let ipfsResp = null;

    if (image.raw) ipfsResp = await uploadMediaToIPFS(image.raw);

    const resp = await near.mainContract.createContest({
      title: title,
      entry_fee: entryFee.toString(),
      size: size.toString(),
      currency_ft: currencyFt === "true",
      start_time: dateInSeconds(startTime).toString(),
      end_time: dateInSeconds(endTime).toString(),
      image: ipfsResp ? mediaURL(ipfsResp) : "",
    });

    if (resp.error) {
      setShowNotification(true);
      setNotificationText("Blockchain Error");
      setNotificationDescription(resp.error.toString());
    } else {
      setShowNotification(true);
      setNotificationText("Contest was created!");
    }

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
      <div className="flex flex-col lg:flex-row gap-x-10">
        <div>
          <label
            htmlFor="upload-button"
            className="flex justify-center items-center w-52 h-52 rounded-xl
            bg-violet-200/20 hover:bg-violet-300/10 cursor-pointer border
            border-dashed border-violet-300/50"
          >
            {image.preview ? (
              <img
                className="p-[2px] object-cover w-52 h-52 rounded-xl"
                src={image.preview}
              />
            ) : (
              <div className="flex w-full flex-col justify-center items-center text-center">
                <PlusIcon className="w-20 h-20" />
                <div className="mt-2 text-xs">
                  Click to
                  <br /> upload photo
                </div>
              </div>
            )}
          </label>
          <input
            className="hidden"
            id="upload-button"
            type="file"
            onChange={uploadPhoto}
          />
        </div>
        <div className="flex flex-col w-2/3">
          <div className="mb-5">
            <Input
              id="contest_title"
              placeholder="Contest Title"
              val={title}
              handleChange={setTitle}
            />
          </div>
          <div className="mb-5">
            <Input
              placeholder="Number of participants"
              type="number"
              min={2}
              val={size}
              handleChange={setSize}
            />
          </div>
          <div className="flex gap-x-5 mb-5">
            <div className="w-2/3">
              <Input
                type="number"
                min={0}
                placeholder="Entry Fee"
                val={entryFee}
                handleChange={setEntryFee}
              />
            </div>
            <div className="w-1/3">
              <Select
                id="currency"
                placeholder="Currency"
                handleChange={(e) => setCurrencyFt(e.target.value)}
                value={currencyFt}
                options={[
                  { label: "CNT", value: true },
                  { label: "NEAR", value: false },
                ]}
              />
            </div>
          </div>
          <div className="flex w-full gap-x-5 justify-between bg-gray-900">
            <div className="w-full">
              <Input
                dateTime={startTime}
                setDateTime={setStartTime}
                type="date"
                placeholder="Start Date"
              />
            </div>
            <div className="w-full">
              <Input
                dateTime={endTime}
                setDateTime={setEndTime}
                type="date"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
