import { PlusIcon } from "@heroicons/react/solid";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Wrapper } from "../../assets/styles/common.style";
import { Button } from "../../components/Button";
import { ContestItem } from "../../components/contest/ContestItem";
import { CreateContestModal } from "../../components/contest/CreateContestModal";
import { JoinContestModal } from "../../components/contest/JoinContestModal";
import { Header } from "../../components/Header";
import { Skeleton } from "../../components/Skeleton";
import { NearContext } from "../../context/near";

export const Contest = () => {
  const near = useContext(NearContext);

  const [loading, isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [contests, setContests] = useState([]);
  const [mode, setMode] = useState(0);

  const showActive = async () => {
    isLoading(true);
    const contests = await near.mainContract.getContests();
    const active = contests.filter(
      (c) =>
        new Date(parseInt(c.start_time)) < new Date() &&
        new Date(parseInt(c.end_time)) > new Date()
    );
    setContests(active);
    setMode(0);
    isLoading(false);
  };

  const showIncoming = async () => {
    isLoading(true);
    const contests = await near.mainContract.getContests();
    const incomming = contests.filter(
      (c) => new Date(parseInt(c.start_time)) > new Date()
    );
    setContests(incomming);
    setMode(1);
    isLoading(false);
  };

  const showPast = async () => {
    isLoading(true);
    const contests = await near.mainContract.getContests();
    const past = contests.filter(
      (c) =>
        new Date(parseInt(c.start_time)) < new Date() &&
        new Date(parseInt(c.end_time)) < new Date()
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
    <div
      onClick={() => setMode(tab)}
      className={`hover:cursor-pointer text-base px-3 hover:text-white font-semibold tracking-wide ${
        mode === tab ? "text-white" : "text-white/30"
      }`}
    >
      {title}
      <div
        className={`h-[2px] mt-3 hover:bg-white ${
          mode === tab ? "bg-white" : "bg-white/30"
        }`}
      ></div>
    </div>
  );

  return (
    <>
      <Header />

      <div className="relative">
        <img
          src="https://assets.website-files.com/605a8ad8853d7fc62334c73e/60d54316de3f53dd3d119282_bubble-1-nft-webflow-template.png"
          width="368.5"
          className="absolute -left-16 w-40"
        />
        <img
          src="https://assets.website-files.com/605a8ad8853d7fc62334c73e/605a9f1433e846624e81f793_donut-nft-webflow-template.png"
          className="absolute -right-16 top-72 w-32"
        />
      </div>

      <div className="flex flex-col lg:flex-row mx-5 lg:mx-32 mt-32">
        <div className="w-full">
          <>
            <Container className="mt-10">
              <div className="w-full sm:flex items-center justify-between">
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
              <div className="mt-10">
                {loading ? (
                  <Skeleton />
                ) : (
                  <div className="w-full flex gap-x-10 gap-y-16 flex-wrap justify-center">
                    {contests?.map((contest, index) => (
                      <ContestItem
                        contest={contest}
                        index={index}
                        handleJoin={() => setShowJoinModal(true)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </>
        </div>
      </div>
    </>
  );
};
