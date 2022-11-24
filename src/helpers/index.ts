import { IRange } from "@/interfaces";
import { randomBytes } from "crypto";
import { cloneDeep, merge } from "lodash";
import { Connection, Types } from "mongoose";
import { join } from "path";
import * as FS from "fs";
import { Test, TestingModule } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common";
import { AppMongooseModule } from "@/providers/app-mongoose.module";
import { AppFileManagerModule } from "@/providers/app-file-manager.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { getConnectionToken } from "@nestjs/mongoose";
import { FileManager } from "@/libs/file-manager";

type EntityWithId = { id: string };

export function randomAddress() {
  return `0x${randomBytes(20).toString("hex")}`;
}

export const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
}

export const assemblyContractRoute = (contract: string, network: string) => {

  const mapping = {
    'Dassets': 'erc1155',
    'InteractERC721': 'erc721',
  }

  return `${network}-${mapping[contract]}`;
}

export const typeToContractName = (type: string): string => {

  const mapping = {
    'erc1155': 'Dassets',
    'erc721': 'InteractERC721',
  }

  return mapping[type];
}

export const generateDefaultTestingModule = async (metadata: ModuleMetadata = {}) => {

  if(metadata.imports) {
    metadata.imports = [
      EventEmitterModule.forRoot(),
      AppMongooseModule,
      AppFileManagerModule,
      ...metadata.imports,
    ];
  }

  const app: TestingModule = await Test.createTestingModule(metadata).compile();

  return app;
}

export function getEventsFromAbi(abi: any[]): any[] {
  return abi.filter(e => e.type === "event").map(n => n.name);
}

export const generateDefaultTestHooks = (opts: {
  metadata: ModuleMetadata , 
  beforeEachHandler: (app: TestingModule) => Promise<void>, 
  afterEachHandler: () => Promise<void>
}) => {

  let app: TestingModule;

  beforeEach(async () => {
    app = await generateDefaultTestingModule(opts.metadata);

    const conn = app.get<Connection>(getConnectionToken());
    const fm = app.get<FileManager>(FileManager);
    
    await conn.dropDatabase();
    await fm.purgeAll();
    purgeLocalTestingContractRoutes();

    await opts.beforeEachHandler(app);

    await app.init();
  });

  afterEach(async () => {
    await opts.afterEachHandler();
    await app.close();
  });
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


export function purgeLocalTestingContractRoutes() {
  const path = getContractsPath('routes');
  const files = FS.readdirSync(path);

  for (const file of files) {
    if(file.includes('local-test')) {
      FS.unlinkSync(join(path, file));
    }
  }
}