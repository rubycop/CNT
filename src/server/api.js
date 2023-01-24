const Big = require("big.js");
const { connect, keyStores, utils, Contract } = require("near-api-js");
const { getConfig } = require("../../near/config");

function convertToTera(amount) {
  return Big(amount)
    .times(10 ** 12)
    .toFixed();
}

const VIEW_METHODS = [];

const CHANGE_METHODS = [
  "set_winner"
];

const nearConfig = getConfig(process.env.NODE_ENV || "testnet");

const initContract = async () => {
  const keyPair = new utils.key_pair.KeyPairEd25519(
    process.env.ACCOUNT_PRIVATE_KEY
  );
  const keyStore = new keyStores.InMemoryKeyStore();
  await keyStore.setKey(nearConfig.networkId, nearConfig.contractName, keyPair);
  const near = await connect(
    Object.assign({ deps: { keyStore: keyStore } }, nearConfig)
  );

  const account = await near.account(nearConfig.contractName);

  return await new Contract(account, nearConfig.contractName, {
    viewMethods: VIEW_METHODS,
    changeMethods: CHANGE_METHODS,
  });
};

module.exports = {
  initContract,
};
