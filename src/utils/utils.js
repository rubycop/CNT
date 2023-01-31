import Big from "big.js";
import {
  NFTStorage,
  File,
} from "../../node_modules/nft.storage/dist/bundle.esm.min.js";
import near_logo from "../assets/images/near-logo.png";

export const formatDate = (date) => new Date(date).toLocaleDateString();

const timeDiff = (countSec) => {
  let days = Math.floor((countSec % 31536000) / 86400);
  let hours = Math.floor(((countSec % 31536000) % 86400) / 3600);
  let minutes = Math.floor((((countSec % 31536000) % 86400) % 3600) / 60);
  let seconds = Math.floor((((countSec % 31536000) % 86400) % 3600) % 60);
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return [days, hours, minutes, seconds];
};

export const secondsToString = (countSec) => {
  let [days, hours, minutes, seconds] = timeDiff(countSec);
  if (days) return days + " days " + hours + " hours ";
  return hours + " hours " + minutes + " min " + seconds + " sec.";
};

export const diffDays = (time) => {
  const timeNow = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = new Date(time).getTime() - timeNow;
  return parseInt(diff / oneDay);
};

// time diff for seconds
export const timeDiffSeconds = (time) => {
  const timeNow = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = timeNow - new Date(time).getTime();
  return (oneDay - diff) / 1000;
};

export const convertToYocto = (amount) => {
  return Big(amount)
    .times(10 ** 24)
    .toFixed();
};

export const convertFromYocto = (amount) => {
  return Big(amount) / (10 ** 24).toFixed();
};

export const formatNumber = (n) => {
  return parseInt(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getLevel = (n) => {
  switch (true) {
    case n < 30:
      return 1;
    case n >= 30 && n < 50:
      return 2;
    case n >= 50 && n < 120:
      return 3;
    case n >= 120 && n < 250:
      return 4;
    case n >= 250 && n < 600:
      return 5;
    case n >= 60:
      return 6;
    default:
      return 1;
  }
};

export const convertToTera = (amount) => {
  return Big(amount)
    .times(10 ** 12)
    .toFixed();
};

export const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const TrophyIcon = ({ styles, onlyIcon }) => (
  <div
    className={`${
      !onlyIcon && "rounded-full p-4 bg-black/80 text-yellow-400 shadow-xl"
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={styles}
    >
      {" "}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
      />{" "}
    </svg>
  </div>
);

export const uploadMediaToIPFS = async (media) => {
  return new Promise(async (resolve, reject) => {
    const name = `${+new Date()}.png`;
    const image = new File([media], name, {
      type: media.type,
      lastModified: new Date().getTime(),
    });

    const nftStorage = new NFTStorage({ token: process.env.IPFS_API_KEY });
    const token = await nftStorage.store({
      image,
      name,
      description: `${name}`,
    });

    if (token.url) {
      resolve(token.data.image.pathname.replace("//", ""));
    }
    reject("Error: IPFS Upload failed");
  });
};

export const resizeFileImage = (file, max_width, max_height) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;

      setTimeout(() => {
        const canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let width = img.width;
        let height = img.height;

        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject("Can't read image");
          }
        }, file.type);
      }, 300);
    };
    reader.readAsDataURL(file);
  });
};

export const mediaURL = (ipfsHash) => {
  return `https://ipfs.fleek.co/ipfs/${ipfsHash}`;
};

export const PLATFORM_FEE = 0.05;

export const Currency = ({ contest }) => (
  <>
    {contest.currency_ft ? (
      <span className="ml-1">CNT</span>
    ) : (
      <img className="w-6 h-6" src={near_logo} />
    )}
  </>
);

export const isIncomming = (contest) =>
  new Date(parseInt(contest.start_time)) > new Date();

export const isActive = (contest) =>
  new Date(parseInt(contest.start_time)) < new Date() &&
  new Date(parseInt(contest.end_time)) > new Date();

export const isPast = (contest) => !isIncomming(contest) && !isActive(contest);
