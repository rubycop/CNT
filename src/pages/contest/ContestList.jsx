import { PlusIcon } from "@heroicons/react/solid";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Wrapper } from "../../assets/styles/common.style";
import { Button } from "../../components/Button";
import { ContestItem } from "../../components/contest/ContestItem";
import { CreateContestModal } from "../../components/contest/CreateContestModal";
import { JoinContestModal } from "../../components/contest/JoinContestModal";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Skeleton } from "../../components/Skeleton";
import { Tab } from "../../components/Tab";
import { NearContext } from "../../context/near";
import private_contest from "../../assets/images/private_contest.png";
import public_contest from "../../assets/images/public_contest.jpeg";

export const ContestList = () => {
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

  const Section = ({ title, children }) => (
    <div className="shadow-md mx-10 py-16" id="infos">
      <h1 className="wow fadeIn text-white text-4xl font-semibold">{title}</h1>
      <div className="w-full bg-gray-800 mt-8 mb-12 h-[1px]"></div>
      {children}
    </div>
  );

  const CreateContestItem = ({ handleClick, title, description, src }) => (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:border-violet-700 hover:shadow-lg hover:shadow-violet-500/50 flex flex-col lg:w-96 p-7 rounded-2xl bg-gray-900 border border-solid border-violet-300/20"
    >
      <div className="relative w-full h-60">
        <img
          className="w-full h-full object-center object-cover rounded-xl"
          src={src}
        />
      </div>
      <div className="justify-between flex flex-col w-full">
        <div className="mt-6 mb-5 w-full text-center">
          <h2 className="text-2xl mb-5 font-semibold line-clamp-2">{title}</h2>
          <h4 className="text-base mb-5 text-violet-200/50 font-medium">
            {description}
          </h4>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <div className="relative lg:block hidden">
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

      <div className="flex flex-col lg:flex-row mx-0 lg:mx-20 mt-16">
        <div className="w-full">
          <Section title="Create Contest">
            <div className="wow fadeInUp w-full lg:px-0 flex gap-10 flex-col lg:flex-row justify-center">
              <CreateContestItem
                src={public_contest}
                title="Public Contest"
                description="Everyone can join contest"
                handleClick={() => setShowModal(true)}
              />

              <CreateContestItem
                src={private_contest}
                title="1-to-1 Contest"
                description={
                  <>
                    Only requester can join contest.
                    <br />
                    Coming soon...
                  </>
                }
                handleClick={() => {}}
              />
            </div>

            <CreateContestModal
              showModal={showModal}
              setShowModal={setShowModal}
            />
          </Section>
          <Section
            title={`${
              mode === 0 ? "Active" : mode === 1 ? "Incoming" : "Past"
            } Contests`}
          >
            <div className="w-full sm:flex items-center justify-between">
              <div className="flex lg:flex-row flex-col items-center gap-5  w-full">
                <Tab mode={mode} setMode={setMode} title="Active" tab={0} />
                <Tab mode={mode} setMode={setMode} title="Incomming" tab={1} />
                <Tab mode={mode} setMode={setMode} title="Past" tab={2} />
              </div>
            </div>
            <div className="mt-10">
              {loading ? (
                <Skeleton />
              ) : (
                <div className="w-full flex gap-x-6 gap-y-10 flex-wrap justify-center">
                  {contests?.map((contest, index) => (
                    <ContestItem
                      small
                      contest={contest}
                      index={index}
                      handleJoin={() => setShowJoinModal(true)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </>
  );
};
