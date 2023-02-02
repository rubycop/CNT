import { ArrowDownIcon, DocumentSearchIcon } from "@heroicons/react/solid";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  Children,
} from "react";
import { Header } from "../components/Header";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Button } from "../components/Button";
import { ContestItem } from "../components/contest/ContestItem";
import boost from "../assets/images/boost.png";
import banner2 from "../assets/images/banner2.png";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";

import "animate.css";
import WOW from "wow.js";
import { NearContext } from "../context/near";
import { HeartIcon } from "@heroicons/react/outline";
import { isIncoming, isIncomming } from "../utils/utils";
import { ContestImage } from "../components/contest/ContestImage";
import { __esModule } from "css-loader/dist/utils";

export const Home = () => {
  const near = useContext(NearContext);

  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [contests, setContests] = useState([]);
  const serviceRef = useRef(null);

  let navigate = useNavigate();

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getParticipants = async () => {
    setLoading(true);
    const contests = await near.mainContract.getContests();
    let _participants = await near.mainContract.getParticipants();

    const winner_ids = contests.map((c) => c.winner_ids).flat(1);
    _participants = _participants.filter((p) => winner_ids.includes(p.id));
    _participants = _participants.map((p) => {
      p.contest = contests.find((c) => c.id === p.contest_id);
      return p;
    });
    setParticipants(_participants);
    setLoading(false);
  };

  useEffect(() => {
    new WOW().init();
    if (near?.wallet) getParticipants();
  }, [near?.wallet]);

  // if (loading)
  //   return (
  //     <>
  //       <Header />
  //       <Wrapper>
  //         <Skeleton />
  //       </Wrapper>
  //     </>
  //   );

  const showIncoming = async () => {
    setLoading(true);
    const contests = await near.mainContract.getContests();
    const incomming = contests.filter((c) => isIncomming(c));
    setContests(incomming.reverse().slice(0, 3));
    setLoading(false);
  };

  useEffect(() => {
    showIncoming();
  }, []);

  const ServiceItem = ({ image, text, delay }) => (
    <div
      className="wow fadeInUp w-full lg:w-72 bg-gray-900 rounded-2xl border border-solid border-violet-300/20"
      data-wow-delay={delay}
    >
      <div className="p-10 flex flex-row lg:flex-col">
        <div className="icon">
          <img src={image} alt="precise data" className="rounded-full w-16" />
        </div>
        <div className="font-regular ml-5 lg:ml-0 lg:mt-5 text-lg tracking-wide">
          {text}
        </div>
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="infos shadow-md mx-10 pt-16" id="infos">
      <h1 className="wow fadeIn text-white text-4xl font-semibold">{title}</h1>
      <div className="w-ful bg-gray-800 mt-8 mb-12 h-[1px]"></div>
      {children}
    </div>
  );

  return (
    <>
      <Header />

      <div className="relative">
        <img
          src="https://assets.website-files.com/605a8ad8853d7fc62334c73e/605a9c8e59d1b810c572a570_blur-blob-nft-webflow-template.svg"
          className="absolute -left-32 top0 w-full -z-10"
        />
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
        <div className="w-full lg:w-3/4 z-0 h-full lg:mt-20">
          <div className="container px-3 mx-auto flex flex-wrap flex-col lg:flex-row items-center">
            <div className="flex flex-col w-full lg:w-4/5 justify-center items-start lg:items-center text-center lg:text-left">
              <h1
                data-wow-delay="0.2s"
                className="wow fadeIn my-4 text-7xl font-semibold leading-tight text-white"
              >
                Make The NFT World Better
              </h1>
              <p
                data-wow-delay="0.2s"
                className={`wow fadeIn my-5 text-center lg:text-left leading-normal text-lg mb-8 text-violet-100`}
              >
                Contesty - is a first WEB3 NFT contest app. Participate in
                contests, vote and predict a winner to get rewards. Boost your
                NFT activity and discover new trends in WEB3 world.
              </p>
              <div
                data-wow-delay="0.5s"
                className=" wow fadeInUp flex flex-col lg:flex-row w-full justify-center lg:justify-start gap-5 "
              >
                <Button
                  title="Discover More"
                  white
                  icon={<ArrowDownIcon className="mt-1 ml-2 h-5" />}
                  handleClick={() => scrollTo(serviceRef)}
                />

                <Button
                  title={
                    <a
                      href="https://contesty.gitbook.io/contesty"
                      target="_blank"
                    >
                      Check our Whitepaper
                    </a>
                  }
                  outlined
                  white
                  icon={<DocumentSearchIcon className="ml-2 h-5" />}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          data-wow-delay="0.2s"
          className="wow fadeIn flex mt-10 lg:mt-0 lg:w-1/2 z-0 items-center justify-center h-full"
        >
          <img className="w-full object-cover" src={banner2} />
        </div>
      </div>

      <div
        className="services flex px-10 lg:flex-row flex-col py-16 mt-16"
        ref={serviceRef}
      >
        <img
          src="https://assets.website-files.com/605a8ad8853d7fc62334c73e/60d54316de3f53dd3d119282_bubble-1-nft-webflow-template.png"
          className="absolute bottom-10 -left-12 w-28"
        />
        <div
          className="hidden lg:flex w-1/2 wow fadeIn items-center justify-center"
          data-wow-delay=".5s"
        >
          <img src={boost} className="h-96 mt-10 object-contain" />
        </div>
        <div className="flex-col w-full lg:w-1/2 justify-center">
          <div className="flex flex-col items-start gap-y-3">
            <div
              className="section-heading flex-col
             text-4xl leading-normal tracking-wide"
            >
              <div
                data-wow-delay=".5s"
                className="wow fadeIn font-semibold text-center text-5xl my-5 text-white"
              >
                Compete, Vote & Predict
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-row gap-3">
              <ServiceItem
                delay="0.5s"
                image={require("../assets/template/images/services-03.jpg")}
                text="Take a part in contests and win big prize"
              />

              <ServiceItem
                delay="0.5s"
                image={require("../assets/template/images/services-01.jpg")}
                text="Receive CNT token everytime you vote"
              />
            </div>

            <div className="flex flex-wrap lg:flex-row gap-3">
              <ServiceItem
                delay="1s"
                image={require("../assets/template/images/services-04.jpg")}
                text="Boost you NFT on TOP marketplaces"
              />
              <ServiceItem
                delay="1s"
                image={require("../assets/template/images/services-02.jpg")}
                text="Discover trending NFTs in NEAR ecosystem"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
