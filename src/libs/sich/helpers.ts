import { utils } from "ethers";

export const parseArgsToString = (arg) => {
  if(Array.isArray(arg)) {
    return arg.map(n => parseArgsToString(n));
  } else {
    return String(arg);
  }
}

export const fromWei = (val) => {
  return utils.formatEther(val)
}

export const toWei = (val) => {
  return utils.parseUnits(String(val), 18).toString();
}