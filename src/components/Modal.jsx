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
        <div className="flex border-2 justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="mx-auto md:w-1/2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-900 outline-none focus:outline-none">
            <div className="p-8 pb-0 flex items-start justify-between">
              <h3 className="text-3xl font-semibold">{title}</h3>
              <button
                className="ml-auto bg-transparent border-0 float-right outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="text-violet-300/40 hover:text-violet-300 h-6 w-6 text-4xl font-normal block">
                  ×
                </span>
              </button>
            </div>

            <div className="p-10">{children}</div>

            <div className="flex items-center justify-end p-10 pt-0 gap-x-5">
              <Button
                handleClick={() => setShowModal(false)}
                outlined
                secondary
                title="Cancel"
                icon={<XIcon className="ml-3 h-5 w-5" />}
              />
              <Button
                handleClick={onSubmit}
                title={loading ? "Submiting ..." : "Submit"}
                icon={<CheckIcon className="ml-3 h-5 w-5" />}
                disabled={loading || (collection && collection.length === 0)}
              />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/20 fixed inset-0 z-40"></div>
      </>
    )}
  </>
);
