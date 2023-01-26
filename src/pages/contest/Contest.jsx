import { PlusIcon, ThumbUpIcon, UserCircleIcon } from "@heroicons/react/solid";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Wrapper } from "../../assets/styles/common.style";
import { Button } from "../../components/Button";
import { ContestImage } from "../../components/contest/ContestImage";
import { LikeButton } from "../../components/contest/LikeButton";
import { PredictImage } from "../../components/contest/PredictImage";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Notification } from "../../components/Notification";
import { Skeleton } from "../../components/Skeleton";
import { Tab } from "../../components/Tab";
import { Timer } from "../../components/Timer";
import { NearContext } from "../../context/near";
import { NotificationContext } from "../../context/notification";
import { isActive, mediaURL } from "../../utils/utils";
import public_contest from "../../assets/images/public_contest.jpeg";
import { Voting } from "../../components/contest/Voting";

export const Contest = () => {
  let { id } = useParams();

  const near = useContext(NearContext);
  const {
    setShowNotification,
    setNotificationText,
    setNotificationDescription,
  } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);
  const [contest, setContest] = useState();
  const [predictions, setPredictions] = useState();
  const [totalStake, setTotalStake] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [votes, setVotes] = useState([]);
  const [defaultImg, setDefaultImg] = useState(false);
  const [respReward, setRespReward] = useState();
  const [mode, setMode] = useState(0);

  const vote = async (participant) => {
    setLoading(true);
    const resp = await near.mainContract.vote({
      contest_id: contest.id,
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
    const _contest = await near.mainContract.getContestById({
      contest_id: id.toString(),
    });
    setContest(_contest);
  };

  const getPredictions = async () => {
    const predictionPromises = participants.map((p) => {
      return near.mainContract.getPredictionsByParticipantId({
        participant_id: p.id,
      });
    });

    const _predictions = await Promise.all(predictionPromises);
    console.log(_predictions);
    const _totalStake = _predictions
      ?.map((p) => p.map((item) => item.amount).reduce((a, b) => a + b, 0))
      ?.reduce((a, b) => a + b, 0);

    setTotalStake(_totalStake);
    setPredictions(_predictions);
  };

  const getContestParticipants = async () => {
    const _participants = await near.mainContract.getContestParticipants({
      contest_id: contest.id,
    });

    setParticipants(_participants);
  };

  const getContestVotes = async () => {
    const _votes = await near.mainContract.getContestVotes({
      contest_id: contest.id,
    });

    setVotes(_votes);
  };

  const Prediction = () => (
    <div className="flex w-full lg:w-1/2 justify-center mb-10">
      <div className="flex w-full justify-center gap-x-5">
        {participants.map((p, i) => (
          <PredictImage
            key={i}
            totalStake={totalStake}
            predictions={predictions[i]}
            participant={p}
          />
        ))}
      </div>
    </div>
  );

  const getContestImage = contest?.image || public_contest;

  useEffect(() => {
    getContest();
  }, []);

  useEffect(() => {
    if (contest) {
      setLoading(true);
      getContestParticipants();
      getContestVotes();
      setLoading(false);
    }
  }, [contest]);

  useEffect(() => {
    if (participants) getPredictions();
  }, [participants]);

  if (!contest) return <Header />;

  return (
    <>
      <Header />
      <Notification />

      <div
        style={{
          backgroundImage: "url(" + getContestImage + ")",
        }}
        className="flex w-full bg-cover bg-no-repeat bg-center relative mt-20 h-48 lg:h-80 shadow-lg justify-center items-end"
      >
        <div className="backdrop-blur-md bg-gray-900/60 p-5 flex justify-center w-full shadow-md">
          <div className="flex flex-row z-20 w-full lg:w-1/2 justify-between">
            <div className="flex text-2xl font-semibold">
              {contest.title}
              {isActive(contest) && (
                <div className="text-white ml-5 flex flex-row items-center justify-center w-20 text-sm text-center p-1 px-2 bg-black/30 border border-solid border-green-600 rounded-full">
                  <div className="relative">
                    <div className="absolute animate-ping w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="ml-2">LIVE</span>
                </div>
              )}
            </div>
            <div className="flex ga-x-3">
              <div className="text-2xl mr-5 font-semibold flex gap-x-2 items-center">
                {participants.length}
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-semibold flex gap-x-2 items-center">
                {votes.length}
                <ThumbUpIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative flex-col w-full justify-center items-center">
        <div className="flex flex-row justify-center items-center text-lg my-10  text-violet-200/40 rounded-lg w-full lg:w-1/2">
          <Timer contest={contest} />
        </div>

        {participants.length > 0 ? (
          <>
            {contest.winner_ids.length > 0 ? (
              <div className="w-full mb-10 flex gap-x-6 gap-y-10 flex-wrap justify-center">
                {participants
                  .sort((a, b) => b.votes_count - a.votes_count)
                  .map((p, i) => (
                    <ContestImage
                      contest={contest}
                      participant={p}
                      winner={contest.winner_ids.includes(p.id)}
                    />
                  ))}
              </div>
            ) : (
              isActive(contest) && (
                <>
                  <div className="flex justify-between mb-10 w-1/2 gap-x-5">
                    <Tab mode={mode} setMode={setMode} title="Voting" tab={0} />
                    <Tab
                      mode={mode}
                      setMode={setMode}
                      title="Prediction"
                      tab={1}
                    />
                  </div>

                  {mode === 0 && (
                    <Voting
                      participants={participants}
                      loading={loading}
                      respReward={respReward}
                      vote={vote}
                    />
                  )}
                  {mode === 1 && <Prediction />}
                </>
              )
            )}
          </>
        ) : (
          <h4 className="text-2xl mt-10">No participants yet</h4>
        )}
      </div>
    </>
  );
};
