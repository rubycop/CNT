import Big from "big.js";
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

export const diffDays = (lastClaimTime) => {
  const timeNow = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = new Date(lastClaimTime).getTime() - timeNow;
  return parseInt(diff / oneDay);
};

// time diff for seconds
export const timeDiffSeconds = (lastClaimTime) => {
  const timeNow = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = timeNow - new Date(lastClaimTime).getTime();
  return (oneDay - diff) / 1000;
};

export const convertToYocto = (amount) => {
  return Big(amount)
    .times(10 ** 24)
    .toFixed();
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
