import { Menu } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { utils } from "near-api-js";

export const Dropdown = ({ currentUser, order, isLoading, showAllOrders }) => {
  return (
    <>
      {order.status !== "Paid" && (
        <Menu as="div" className="relative text-left text-gray-700">
          <div>
            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 bg-white">
              <DotsHorizontalIcon className="w-5 h-5" />
            </Menu.Button>
          </div>
          <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {order.status !== "Paid" && (
                <Menu.Item>
                  <button
                    onClick={() => {}}
                    className="block px-4 py-2 text-sm"
                  >
                    Approve
                  </button>
                </Menu.Item>
              )}
              {order.status === "Approved" && order.status !== "Paid" && (
                <Menu.Item>
                  <button
                    onClick={() => {}}
                    className="block px-4 py-2 text-sm"
                  >
                    Pay
                  </button>
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Menu>
      )}
    </>
  );
};
