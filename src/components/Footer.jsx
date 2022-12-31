import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import banner from "../assets/images/banner.png";

export const Footer = () => {
  let navigate = useNavigate();

  return (
    <footer
      className="relative z-0 bg-primary bg-opacity-5 pt-[50px] md:pt-[100px] wow fadeInUp"
      data-wow-delay=".1s"
    >
      <div className="container">
        <div className="flex flex-row mx-10 md:mx-32 text-white text-sm">
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-center md:justify-start">
              <a href="/">
                <img className="h-10" src={logo} />
              </a>
            </div>
            <div className="my-6 text-center md:text-left">
              Discover NFT world with Contesty
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <a
                aria-label="social-link"
                href="https://twitter.com/ContestyNFT"
                target="_blank"
                className="text-white hover:text-violet-300 cursor-pointer mr-6"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="22"
                  width="22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                </svg>
              </a>
              <a
                aria-label="social-link"
                href="https://discord.gg/75G7jaSdWT"
                target="_blank"
                className="text-white hover:text-violet-300 cursor-pointer mr-6"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 640 512"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
                </svg>
              </a>
              <a
                aria-label="social-link"
                href="https://t.me/ContestyNFT"
                target="_blank"
                className="text-white hover:text-violet-300 cursor-pointer mr-6"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 448 512"
                  height="23"
                  width="23"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="w-1/2 px-4 lg:mr-6 hidden md:flex">
            <div className="section-heading leading-normal tracking-wide">
              <div className="font-semibold text-white text-lg mb-10">
                Documentation
              </div>
              <div className="line-dec bg-white"></div>
              <ul className="flex flex-col gap-y-2">
                <li>
                  <a
                    target="_blank"
                    href="https://contesty.gitbook.io/contesty"
                    className="hover:text-violet-200"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://contesty.gitbook.io/contesty/contest"
                    className="hover:text-violet-200"
                  >
                    Contest
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://contesty.gitbook.io/contesty/voting"
                    className="hover:text-violet-200"
                  >
                    Voting
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://contesty.gitbook.io/contesty/prediction"
                    className="hover:text-violet-200"
                  >
                    Prediction
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-1/2 px-4 lg:mr-6 hidden md:flex">
            <div className="section-heading leading-normal tracking-wide">
              <div className="font-semibold text-white text-lg mb-10">
                Support & Terms
              </div>
              <div className="line-dec bg-white"></div>
              <ul className="flex flex-col gap-y-2">
                <li>
                  <a className="hover:text-violet-200" href="/faq">
                    FAQ
                  </a>
                </li>
                <li>
                  <a className="hover:text-violet-200" href="/privacy">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-violet-200" href="/terms">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 bg-primary bg-opacity-10">
        <div className="container">
          <p className="text-violet-200 text-sm text-center tracking-wider">
            © Made by
            <a
              href="https://atomic-lab.io"
              className="hover:underline ml-1 text-violet-200"
              target="_blank"
            >
              Atomic Lab
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
