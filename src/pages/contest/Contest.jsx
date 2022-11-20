import { PlusIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { Container, Row, Wrapper } from "../../assets/styles/common.style";
import { Button } from "../../components/Button";
import { ContestItem } from "../../components/contest/ContestItem";
import { CreateContestModal } from "../../components/contest/CreateContestModal";
import { JoinContestModal } from "../../components/contest/JoinContestModal";
import { Header } from "../../components/Header";
import { Skeleton } from "../../components/Skeleton";

export const Contest = ({ currentUser }) => {
  const [loading, isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [contests, setContests] = useState([]);
  const [mode, setMode] = useState(0);

  const showActive = async () => {
    isLoading(true);
    if (!window.contract) return;

    const contests = await window.contract.get_contests({});
    const active = contests.filter(
      (c) =>
        new Date(c.start_time) < new Date() && new Date(c.end_time) > new Date()
    );
    setContests(active);
    setMode(0);
    isLoading(false);
  };

  const showIncoming = async () => {
    isLoading(true);
    const contests = await window.contract.get_contests({});
    const incomming = contests.filter(
      (c) => new Date(c.start_time) > new Date()
    );
    setContests(incomming);
    setMode(1);
    isLoading(false);
  };

  const showPast = async () => {
    isLoading(true);
    const contests = await window.contract.get_contests({});
    const past = contests.filter(
      (c) =>
        new Date(c.start_time) < new Date() && new Date(c.end_time) < new Date()
    );
    setContests(past);
    setMode(2);
    isLoading(false);
  };

  useEffect(() => {
    if (mode === 0) showActive();
    if (mode === 1) showIncoming();
    if (mode === 2) showPast();
  }, [mode]);

  const FilterTab = ({ tab, title }) => (
    <button
      onClick={() => setMode(tab)}
      className={`py-2 px-8 ${
        mode === tab ? "bg-indigo-100 text-indigo-700" : "text-gray-600"
      } rounded-full`}
    >
      <p>{title}</p>
    </button>
  );

  return (
    <>
      <Header currentUser={currentUser} />
      <Wrapper>
        <Container className="pt-20 flex">
          <div className="w-full">
            <>
              <div className="sm:flex items-center justify-between">
                <div className="flex items-center">
                  <FilterTab title="Active" tab={0} />
                  <FilterTab title="Incomming" tab={1} />
                  <FilterTab title="Past" tab={2} />
                </div>

                <Button
                  title="Create Contest"
                  icon={<PlusIcon className="ml-3 h-5 w-5" />}
                  handleClick={() => setShowModal(true)}
                />

                <CreateContestModal
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              </div>
              {loading ? (
                <Skeleton />
              ) : (
                <div className="mt-7 h-screen">
                  <table className="w-full whitespace-nowrap">
                    <tbody>
                      {contests?.map((contest, index) => (
                        <>
                          <ContestItem
                            contest={contest}
                            currentUser={currentUser}
                            index={index}
                            handleJoin={() => setShowJoinModal(true)}
                          />

                          <JoinContestModal
                            showModal={showJoinModal}
                            setShowModal={setShowJoinModal}
                            currentUser={currentUser}
                            contest={contest}
                          />
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          </div>
        </Container>
      </Wrapper>
    </>
  );
};
