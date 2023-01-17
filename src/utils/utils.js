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
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  return `https://ipfs.io/ipfs/${ipfsHash}`;
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
