import { IRange } from "@/interfaces";
import { randomBytes } from "crypto";
import { cloneDeep, merge } from "lodash";
import { Types } from "mongoose";
import { join } from "path";
import * as FS from "fs";

type EntityWithId = { id: string };

export function randomAddress() {
  return `0x${randomBytes(20).toString("hex")}`;
}

export const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
}

export const assemblyContractRoute = (contract: string, network: string) => {

  const mapping = {
    'InteractERC1155': 'erc1155',
    'InteractERC721': 'erc721',
  }

  return `${network}-${mapping[contract]}`;
}

export const typeToContractName = (type: string): string => {

  const mapping = {
    'erc1155': 'InteractERC1155',
    'erc721': 'InteractERC721',
  }

  return mapping[type];
}

export const smartMergeById = <T1>(source: any[], target: any[]): T1[] => {
  
  const new_els = target.filter(n => !n.id);
  const non_deleted_els = cloneDeep(source.filter(n => target.find(m => m.id === n.id)));

  const res = non_deleted_els.map(n => {
    const target_el = target.find(m => m.id === n.id);
    
    return merge({}, n, target_el);
  })

  res.push(...new_els);

  return res;
}

export const recursiveStringToObjectId = (source: any) => {
  
  for (const key in source) {
    if(typeof source[key] === 'object') {
      recursiveStringToObjectId(source[key]);
    } else {
      source[key] = new Types.ObjectId(source[key]);
    }
  }

}

export function getContractsPath(path_to_add: string): string {
  return join(process.cwd(), 'contracts', path_to_add)
}

export function getInternalContractData(
  contract_name: string, 
  network: string
): { abi: any, address: string } {
  const abi = JSON.parse(FS.readFileSync(getContractsPath(`abis/${contract_name}.json`), 'utf8'));
  const route = JSON.parse(FS.readFileSync(getContractsPath(`routes/${assemblyContractRoute(contract_name, network)}.json`), 'utf8'));

  return {
    address: route.address,
    abi
  }
}

export function rangeToMongoQuery(range: IRange) {
  const query: any = {};

  if(!range.min && !range.max) {
    return { $exists: true };
  } else {
    if (range.min) {
      query.$gte = range.min;
    }
  
    if (range.max) {
      query.$lte = range.max;
    }
  }

  return query;
}