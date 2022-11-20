import { Menu } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { utils } from "near-api-js";

const getAmount = (amount) => utils.format.parseNearAmount(amount);

const GAS = getAmount("0.00000000003");

export const Dropdown = ({ currentUser, order, isLoading, showAllOrders }) => {
  const handleApprove = async (order) => {
    console.log(order);
    isLoading(true);
    await window.contract.approve_order({
      owner_id: currentUser.accountId,
      order_id: order.id,
    });
    await showAllOrders();
    isLoading(false);
  };

  const handlePay = async (order) => {
    isLoading(true);
    await window.contract.pay_for_order(
      {
        receiver_id: order.owner_id,
        order_id: order.id,
      },
      GAS,
      getAmount(order.price)
    );
    await showAllOrders();
    isLoading(false);
  };

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
                    onClick={() => handleApprove(order)}
                    className="block px-4 py-2 text-sm"
                  >
                    Approve
                  </button>
                </Menu.Item>
              )}
              {order.status === "Approved" && order.status !== "Paid" && (
                <Menu.Item>
                  <button
                    onClick={() => handlePay(order)}
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
