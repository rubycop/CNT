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
      (c) => new Date(c.start_time) > new Date()
    );
    setContests(incomming);
    isLoading(false);
  };

  useEffect(() => {
    showIncoming();
  }, []);

  return (
    <>
      <Header currentUser={currentUser} />
      <Wrapper>
        <div className="main-banner" id="top">
          <div className="container">
            <div className="w-1/2 pl-20">
              <h4 className="tracking-wide">
                Make <em>The NFT</em> World{" "}
                <div className="text-purple-700">Better</div>
              </h4>
              <p className="w-full text-neutral-800 font-normal tracking-wide">
                Beat My Nft (BMT) - is a first WEB3 NFT contest service that
                helps people evaluate a NFTs and arrange them in one place.
              </p>
              <div className="flex gap-x-5">
                <Button
                  title="Discover More"
                  icon={<ArrowDownIcon className=" ml-2 h-5" />}
                  handleClick={() => scrollTo(serviceRef)}
                />
                <Button
                  title="Check our Whitepaper"
                  outlined
                  secondary
                  icon={<DocumentSearchIcon className=" ml-2 h-5" />}
                  handleClick={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="services w-full section pt-32" ref={serviceRef}>
          <div className="flex-col w-full">
            <div className="flex flex-col items-end">
              <div className="w-1/2">
                <div className="section-heading text-4xl leading-normal tracking-wide">
                  <h2>
                    <p className="font-semibold text-5xl mt-5 text-violet-600">
                      Contestant & Voter
                    </p>
                  </h2>
                  <div className="line-dec"></div>
                  <p className="w-3/4 text-neutral-700">
                    As a Contestant you can take a part in contests and become
                    famous. Voter can nominate NFT artist by his vote and
                    receive token rewards for that.
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
                      <div className="font-regular mt-5 hover:text-violet-600 text-xl tracking-wide">
                        Take a part in contests and win big prize
                      </div>
                    </div>
                  </div>
                  <div className="w-72 h-56">
                    <div className="service-item">
                      <div className="icon">
                        <img
                          src={require("../assets/template/images/services-04.jpg")}
                          alt="SEO marketing"
                          className="templatemo-feature"
                        />
                      </div>
                      <div className="font-regular mt-5 hover:text-violet-600 text-xl tracking-wide">
                        Become famous NFT artist in web3 world
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-1/2">
                <div className="flex flex-row gap-x-5">
                  <div className="w-72 h-56">
                    <div className="service-item">
                      <div className="icon">
                        <img
                          src={require("../assets/template/images/services-01.jpg")}
                          alt="discover SEO"
                          className="templatemo-feature"
                        />
                      </div>
                      <div className="font-regular mt-5 hover:text-violet-600 text-xl tracking-wide">
                        Earn BMT everytime you vote
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
                      <div className="font-regular mt-5 hover:text-violet-600 text-xl tracking-wide">
                        Discover trending NFTs in NEAR ecosystem
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="infos section" id="infos">
          <h1 className="-mt-5 mb-16 text-center text-white text-5xl">
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

        <div className="projects section" id="projects">
          <div className="container">
            <div className="row">
              <div className="w-full justify-center">
                <div className="section-heading ml-20">
                  <div className="section-heading">
                    <h2 className="font-semibold">Find your best NFT</h2>
                    <div className="line-dec"></div>
                    <p>
                      More than 10 of NEAR projects already evaluated. Choose
                      your best
                    </p>
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
