import { Injectable } from "@nestjs/common";
import { IFileManagerDriver } from "./driver.interface";

@Injectable()
export class FileManager {

  private driver: IFileManagerDriver;

  constructor(driver: IFileManagerDriver) {
    this.driver = driver;
  }

  put(path, content) {
    return this.driver.put(path, content)
  }

  get(path) {
    return this.driver.get(path)
  }

  putFile(path, file) {
    return this.driver.putFile(path, file)
  }

  delete(path) {
    return this.driver.delete(path)
      .catch(err => {})
  }

  url(path) {
    if(!path) {
      return null;
    }
    return this.driver.url(path)
  }

  async purgeAll() {

    if(this.driver.purgeAll instanceof Function) {
      return await this.driver.purgeAll()
    }
  }
};