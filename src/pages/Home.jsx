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

const images = [
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FxIaXPYWmFX0Hqo8zQuuo-FW4tLwJ2p7HZ8G_G0bFFUEU_iGtmHVt9yg_vxfId8pE7Zi4qX2PDnIbC-Dq016AGAB7uuqcDaBYKQCkdmtKbzDa9Q&w=3840&q=75",
    title: "Freaky Felines",
    creator: "ff.nekotoken.near",
    likes: 123,
    contest: { title: "NFT monthly contest" },
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FUXYgy60xqtkb_o-X6bN-lQMl0R_S4zNC_-mnp3LJ4QOAq3sECJjtObSaU9yMNFcu6toeqWixutuqxSenlvy1r4ff98uncVI4IW3hRuB_7Snkyw&w=3840&q=75",
    title: "BEE NFT",
    creator: "ff.nekotoken.near",
    likes: 123,
    contest: { title: "NFT monthly contest" },
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FAbv2bxnsSJ9FYdxO6VUsmXa9M2a-6DFp4-MS_WdSxyV6XWYtfXjvEpRgIbD1hJD8sA9-J_xcE72_6FP2UgjDjBz62Qo7l6WC0k_zUYLGRc6q7Q&w=3840&q=75",
    title: "Kaizo Fighters",
    creator: "kaizo....near",
    likes: 123,
    contest: { title: "NFT monthly contest" },
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2F_4-WjJN3129_UCymSCdqZoxgAkcDGNBCZQXvMHjIbZQxJIWypJDzgcuJuwNAXqap6rJbkKGcBI2ugfRh6hu3EVCT6Xm90n-9ohJuYIz19LprQSw&w=3840&q=75",
    title: "Test",
    creator: "test.near",
    likes: 123,
    contest: { title: "NFT monthly contest" },
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FAjttataWiFGIjVijhwpN0xi0edJZfYZCwQVxVSYR-bcVOsCJcLAiZZrHnIxclMUQ7FeX_G0GXOVDOJCsGmiaPb73qmNkDdeBKSmouobdHVE6QQ&w=3840&q=75",
    title: "El Café Cartel - Gen 1",
    creator: "test.near",
    likes: 123,
    contest: { title: "NFT monthly contest" },
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2FwmAHmLRnjpUy9SunRAXRdMH33MWv_EvxDMWjkF5vBaOzoHU_k3FOgYQABTt9drmZUiIQdxHLn3w25ny5G0iFrcTfrpcHzzBHvZ5opsUttmIfqg&w=3840&q=75",
    title: "Test",
    creator: "test.near",
    likes: 123,
    contest: { title: "NFT monthly contest" },
  },
  {
    src: "https://apollo42.world/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fc19SQf8fRSDfu9oXE06QkYyDIDl0H2yHDlaxJZ6fzr5g9m177eefpAzPjhynEozFGCpaSYK54JKvhxWD5sfsjalqYKCH_Hd9mvizTzGRtov9Rwc&w=3840&q=75",
    title: "Test",
    creator: "test.near",
    likes: 123,
    contest: { title: "NFT monthly contest" },
  },
];

export const Home = ({ currentUser }) => {
  const near = useContext(NearContext);

  const [loading, isLoading] = useState(false);
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
    isLoading(true);
    const _participants = await near.mainContract.getParticipants();
    setParticipants(_participants);
    isLoading(false);
  };

  useEffect(() => {
    new WOW().init();
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
    const contests = await near.mainContract.getContests();
    console.log(contests);
    const incomming = contests.filter(
      (c) => new Date(parseInt(c.start_time)) > new Date()
    );
    setContests(incomming.reverse().slice(0, 3));
    isLoading(false);
  };

  useEffect(() => {
    showIncoming();
  }, []);

  const CarouselItem = ({ image }) => (
    <div className="item mx-3 p-5 bg-gray-900 rounded-2xl">
      <img className="w-full h-64 object-cover rounded-xl" src={image.src} />
      <div className="mt-5 mb-3 flex justify-between">
        <div className="">
          <h5 className="text-xl">{image.title}</h5>
          <h6 className="text-sm">{image.creator}</h6>
        </div>
        <div className="">
          <HeartIcon className="w-7 h-7" />
          {image.likes}
        </div>
      </div>

      <a href="" className="text-sm">
        {image.contest.title} <i className="fa fa-link"></i>
      </a>
    </div>
  );

  const ServiceItem = ({ image, text, delay }) => (
    <div className="wow fadeInUp w-full lg:w-72" data-wow-delay={delay}>
      <div className="p-10 rounded-2xl flex flex-row lg:flex-col bg-gray-900">
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
    <div className="infos shadow-md mx-10 py-16" id="infos">
      <h1 className="wow fadeIn text-white text-4xl font-semibold">{title}</h1>
      <div className="w-ful bg-gray-800 mt-8 mb-12 h-[1px]"></div>
      {children}
    </div>
  );

  return (
    <>
      <Header currentUser={currentUser} />
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
        className="services flex px-10 lg:flex-row flex-col py-16 mt-10"
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

      <Section title="Incoming Contests">
        <div className="wow fadeInUp w-full px-10 lg:px-24 flex gap-16 flex-col lg:flex-row justify-center">
          {contests.map((contest, index) => (
            <ContestItem
              contest={contest}
              currentUser={currentUser}
              index={index}
            />
          ))}
        </div>
      </Section>

      <Section title="Latest Winners">
        <div className="wow fadeIn container-fluid">
          <div className="flex-row">
            <div className="w-full justify-center">
              <AliceCarousel
                mouseTracking
                autoPlay
                autoPlayInterval={2000}
                disableButtonsControls
                disableDotsControls
                infinite
                responsive={{
                  2000: {
                    items: 11,
                  },
                  1200: {
                    items: 4,
                  },
                  800: {
                    items: 3,
                  },
                  0: {
                    items: 1,
                  },
                }}
                items={images.map((img) => (
                  <CarouselItem image={img} />
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
      </Section>
      
      <Footer />
    </>
  );
};
