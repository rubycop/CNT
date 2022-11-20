import { CheckIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import React from "react";
import { Row } from "../assets/styles/common.style";
import { Input, TextArea } from "./Form";

export const Modal = ({
  title,
  showModal,
  setShowModal,
  onSubmit,
  loading,
  children,
}) => (
  <>
    {showModal && (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">{title}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="text-black h-6 w-6 text-2xl block">×</span>
                </button>
              </div>

              <div className="relative p-6 flex-auto">{children}</div>

              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="mr-5 flex flex-row items-center text-violet-600 border-2 border-violet-600 p-3 px-5 rounded-full"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`flex flex-row items-center text-white p-3 px-5 rounded-full bg-violet-600 ${
                    loading && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={onSubmit}
                  disabled={loading}
                >
                  <Row className="justify-between">
                    <CheckIcon className="mr-3 h-5 w-5" />
                    Create
                  </Row>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    )}
  </>
);
