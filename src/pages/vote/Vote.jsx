import { PlusIcon, ThumbUpIcon, UserCircleIcon } from "@heroicons/react/solid";
import { Carousel } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Wrapper } from "../../assets/styles/common.style";
import { Button } from "../../components/Button";
import { Voting } from "../../components/contest/Voting";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Notification } from "../../components/Notification";
import { Skeleton } from "../../components/Skeleton";
import { Timer } from "../../components/Timer";
import { NearContext } from "../../context/near";
import { NotificationContext } from "../../context/notification";
import { mediaURL, shuffle } from "../../utils/utils";

export const Vote = () => {
  const near = useContext(NearContext);
  const {
    setShowNotification,
    setNotificationText,
    setNotificationDescription,
  } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);
  const [activeContests, setActiveContests] = useState();
  const [participants, setParticipants] = useState([]);
  const [defaultImg, setDefaultImg] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [respReward, setRespReward] = useState();

  const vote = async (participant) => {
    setLoading(true);
    const resp = await near.mainContract.vote({
      contest_id: participant.contest_id,
      participant_id: participant.id,
    });

    if (resp.error) {
      setShowNotification(true);
      setNotificationText("Blockchain Error");
      setNotificationDescription(resp.error.toString());
    } else {
      setShowNotification(true);
      setNotificationText("Congrats! ");
      setNotificationDescription("You've earned 3 CNT and XP");
      setRespReward(3);
    }
    setLoading(false);
  };

  const getContest = async () => {
    const contests = await near.mainContract.getFullContests();
    const _activeContests = contests.filter(
      (c) =>
        new Date(parseInt(c.start_time)) < new Date() &&
        new Date(parseInt(c.end_time)) > new Date()
    );
    setActiveContests(_activeContests);
  };

  const getContestParticipants = async () => {
    const participantsPromises = activeContests.map((c) => {
      return near.mainContract.getContestParticipants({
        contest_id: c.id,
      });
    });

    const _participants = await Promise.all(participantsPromises);
    setParticipants(shuffle(_participants.flat(1)));
  };

  useEffect(() => {
    setLoading(true);
    getContest();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeContests) {
      setLoading(true);
      getContestParticipants();
      setLoading(false);
    }
  }, [activeContests]);

  if (!activeContests && !loading)
    return (
      <>
        <Header />
        <div className="justify-center items-center flex h-screen">
          <div className="text-4xl font-bold text-center w-64">
            There is no contest to vote
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <Notification />

      <div className="flex relative flex-col w-full justify-center items-center mt-32">
        {participants.length > 0 && (
          <Voting
            participants={participants}
            loading={loading}
            respReward={respReward}
            vote={vote}
          />
        )}
      </div>

      <Footer />
    </>
  );
};
