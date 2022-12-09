import { CheckIcon } from "@heroicons/react/outline";
import { PlusIcon, XIcon } from "@heroicons/react/solid";
import React from "react";
import { Row } from "../assets/styles/common.style";
import { Button } from "./Button";
import { Input, TextArea } from "./Form";

export const Modal = ({
  title,
  showModal,
  setShowModal,
  onSubmit,
  loading,
  children,
  collection,
}) => (
  <>
    {showModal && (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5">
                <h3 className="text-3xl font-semibold">{title}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="text-black h-6 w-6 text-2xl block">×</span>
                </button>
              </div>

              <div className="relative p-6 flex-auto">{children}</div>

              <div className="flex items-center justify-end p-6 gap-x-5">
                <Button
                  handleClick={() => setShowModal(false)}
                  outlined
                  secondary
                  title="Cancel"
                  icon={<XIcon className="ml-3 h-5 w-5" />}
                />
                <Button
                  handleClick={onSubmit}
                  title="Join"
                  icon={<CheckIcon className="ml-3 h-5 w-5" />}
                  disabled={loading || collection.length === 0}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    )}
  </>
);
