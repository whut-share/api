export interface IFileManagerDriver {

  putFile(path: string, file: string): Promise<void>;

  get(path: string): Promise<string | Buffer>;
  
  put(path: string, content: string | Buffer): Promise<void>;

  delete(path: string): Promise<void>;

  url(path: string): string;

  purgeAll?(): Promise<void>;
}