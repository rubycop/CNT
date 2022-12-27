import { ArrowDownIcon, DocumentSearchIcon } from "@heroicons/react/solid";
import React, { useState, useEffect, useRef } from "react";
import { Container, Wrapper } from "../assets/styles/common.style";
import { Header } from "../components/Header";
import { Skeleton } from "../components/Skeleton";
import { groupBy } from "../utils/utils";
import Carousel from "better-react-carousel";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Button } from "../components/Button";
import { ContestItem } from "../components/contest/ContestItem";
import banner from "../assets/images/banner.png";
import boost from "../assets/images/boost.png";

const images = [
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FxIaXPYWmFX0Hqo8zQuuo-FW4tLwJ2p7HZ8G_G0bFFUEU_iGtmHVt9yg_vxfId8pE7Zi4qX2PDnIbC-Dq016AGAB7uuqcDaBYKQCkdmtKbzDa9Q&w=3840&q=75",
    title: "Freaky Felines",
    creator: "ff.nekotoken.near",
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FUXYgy60xqtkb_o-X6bN-lQMl0R_S4zNC_-mnp3LJ4QOAq3sECJjtObSaU9yMNFcu6toeqWixutuqxSenlvy1r4ff98uncVI4IW3hRuB_7Snkyw&w=3840&q=75",
    title: "BEE NFT",
    creator: "ff.nekotoken.near",
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FAbv2bxnsSJ9FYdxO6VUsmXa9M2a-6DFp4-MS_WdSxyV6XWYtfXjvEpRgIbD1hJD8sA9-J_xcE72_6FP2UgjDjBz62Qo7l6WC0k_zUYLGRc6q7Q&w=3840&q=75",
    title: "Kaizo Fighters",
    creator: "kaizo....near",
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2F_4-WjJN3129_UCymSCdqZoxgAkcDGNBCZQXvMHjIbZQxJIWypJDzgcuJuwNAXqap6rJbkKGcBI2ugfRh6hu3EVCT6Xm90n-9ohJuYIz19LprQSw&w=3840&q=75",
    title: "Test",
    creator: "test.near",
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FAjttataWiFGIjVijhwpN0xi0edJZfYZCwQVxVSYR-bcVOsCJcLAiZZrHnIxclMUQ7FeX_G0GXOVDOJCsGmiaPb73qmNkDdeBKSmouobdHVE6QQ&w=3840&q=75",
    title: "El Café Cartel - Gen 1",
    creator: "test.near",
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FwmAHmLRnjpUy9SunRAXRdMH33MWv_EvxDMWjkF5vBaOzoHU_k3FOgYQABTt9drmZUiIQdxHLn3w25ny5G0iFrcTfrpcHzzBHvZ5opsUttmIfqg&w=3840&q=75",
    title: "Test",
    creator: "test.near",
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fc19SQf8fRSDfu9oXE06QkYyDIDl0H2yHDlaxJZ6fzr5g9m177eefpAzPjhynEozFGCpaSYK54JKvhxWD5sfsjalqYKCH_Hd9mvizTzGRtov9Rwc&w=3840&q=75",
    title: "Test",
    creator: "test.near",
  },
];

export const Home = ({ currentUser }) => {
  const [loading, isLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [contests, setContests] = useState([]);
  const [defaultImg, setDefaultImg] = useState(false);
  const serviceRef = useRef(null);

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getParticipants = async () => {
    isLoading(true);
    const _participants = await window.contract?.get_participants({});
    setParticipants(_participants);
    isLoading(false);
  };

  useEffect(() => {
    if (currentUser) getParticipants();
  }, [currentUser]);

  // if (loading)
  //   return (
  //     <>
  //       <Header currentUser={currentUser} />
  //       <Wrapper>
  //         <Skeleton />
  //       </Wrapper>
  //     </>
  //   );

  const showIncoming = async () => {
    isLoading(true);
    const contests = await window.contract.get_contests({});
    const incomming = contests.filter(
      (c) => new Date(parseInt(c.start_time)) > new Date()
    );
    setContests(incomming.reverse().slice(0, 2));
    isLoading(false);
  };

  useEffect(() => {
    showIncoming();
  }, []);

  return (
    <>
      <Header currentUser={currentUser} />
      <img src={banner} className="w-full absolute object-cover -z-10 top-0" />
      <Wrapper>
        <div className="pt-[180px]" id="top">
          <div className="container">
            <div className="pl-40">
              <div className="w-1/2  text-6xl tracking-wide leading-tight">
                <span className="font-semibold pr-3 text-violet-100">
                  Make The NFT World Better
                </span>
              </div>
              <div className="w-1/2  text-base font-normal my-10 leading-relaxed tracking-wide text-white">
                Contesty - is a first WEB3 NFT contest app. Compete in contests
                to win big prize, vote and predict a winner to get rewards.
              </div>
              <div className="flex gap-x-5">
                <Button
                  title="Discover More"
                  white
                  icon={<ArrowDownIcon className=" ml-2 h-5" />}
                  handleClick={() => scrollTo(serviceRef)}
                />
                <Button
                  title="Check our Whitepaper"
                  outlined
                  white
                  icon={<DocumentSearchIcon className=" ml-2 h-5" />}
                  handleClick={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="services flex section py-16 mt-48 bg-violet-50"
          ref={serviceRef}
        >
          <div className="w-1/2 flex items-center justify-center">
            <img src={boost} className="w-1/2 object-contain" />
          </div>
          <div className="flex-col w-1/2 justify-center">
            <div className="flex flex-col items-start">
              <div>
                <div className="section-heading text-4xl leading-normal tracking-wide">
                  <div className="font-semibold text-5xl my-5">
                    Compete, Vote & Predict
                  </div>
                  <div className="line-dec bg-black"></div>
                  <p className="w-1/2 text-neutral-700">
                    The best way to boost your NFT and win contest prize pool
                  </p>
                </div>
                <div className="flex flex-row gap-x-5">
                  <div className="w-72 h-56">
                    <div className="service-item">
                      <div className="icon">
                        <img
                          src={require("../assets/template/images/services-03.jpg")}
                          alt="precise data"
                          className="templatemo-feature"
                        />
                      </div>
                      <div className="font-regular mt-5 hover:text-violet-600 text-lg tracking-wide">
                        Take a part in contests and win big prize
                      </div>
                    </div>
                  </div>
                  <div className="w-72 h-56">
                    <div className="service-item">
                      <div className="icon">
                        <img
                          src={require("../assets/template/images/services-01.jpg")}
                          alt="SEO marketing"
                          className="templatemo-feature"
                        />
                      </div>
                      <div className="font-regular mt-5 hover:text-violet-600 text-lg tracking-wide">
                        Receive CNT token everytime you vote
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex flex-row gap-x-5">
                <div className="w-72 h-56">
                  <div className="service-item">
                    <div className="icon">
                      <img
                        src={require("../assets/template/images/services-04.jpg")}
                        alt="discover SEO"
                        className="templatemo-feature"
                      />
                    </div>
                    <div className="font-regular mt-5 hover:text-violet-600 text-lg tracking-wide">
                      Boost you NFT on TOP marketplaces
                    </div>
                  </div>
                </div>
                <div className="w-72 h-56">
                  <div className="service-item">
                    <div className="icon">
                      <img
                        src={require("../assets/template/images/services-02.jpg")}
                        alt="data analysis"
                        className="templatemo-feature"
                      />
                    </div>
                    <div className="font-regular mt-5 hover:text-violet-600 text-lg tracking-wide">
                      Discover trending NFTs in NEAR ecosystem
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="infos py-16" id="infos">
          <h1 className="mb-16 text-center text-white text-5xl">
            Incomming Contests
          </h1>
          <div className="w-full px-20 flex gap-x-10 flex-row justify-between">
            {contests.map((contest, index) => (
              <ContestItem
                contest={contest}
                currentUser={currentUser}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="projects py-16" id="projects">
          <div className="container">
            <div className="row">
              <div className="w-full justify-center">
                <div className="section-heading ml-20">
                  <div className="section-heading">
                    <h2 className="font-semibold">Latest Winners</h2>
                    <div className="line-dec"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="w-full justify-center">
                <AliceCarousel
                  mouseTracking
                  autoPlay
                  autoPlayInterval={2000}
                  disableButtonsControls
                  disableDotsControls
                  infinite
                  responsive={{
                    0: {
                      items: 5,
                    },
                  }}
                  items={images.map((img) => (
                    <div className="item mx-2">
                      <img className="w-72 h-72 bg-cover " src={img.src} />
                      <div className="down-content">
                        <h5>{img.title}</h5>
                        <a href="#">
                          <i className="fa fa-link"></i>
                        </a>
                      </div>
                    </div>
                  ))}
                />
                {/* {participants
                    .sort((a, b) => b.votes_count - a.votes_count)
                    .map((p, i) => (
                      <Carousel.Item>
                        <div className="item">
                          <img
                            className="w-72 h-90 bg-cover rounded-3xl"
                            src={
                              defaultImg || `https://ipfs.io/ipfs/{p.nft_src}`
                            }
                            onError={() =>
                              setDefaultImg(
                                "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FAbv2bxnsSJ9FYdxO6VUsmXa9M2a-6DFp4-MS_WdSxyV6XWYtfXjvEpRgIbD1hJD8sA9-J_xcE72_6FP2UgjDjBz62Qo7l6WC0k_zUYLGRc6q7Q&w=3840&q=75"
                              )
                            }
                          />
                          <div className="down-content">
                            <h4>Digital Agency HTML Templates</h4>
                            <a href="#">
                              <i className="fa fa-link"></i>
                            </a>
                          </div>
                        </div>
                      </Carousel.Item>
                    ))} */}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
