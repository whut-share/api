import { promises as FS } from 'fs';
import * as oFS from 'fs';
import * as Path from 'path';
import * as Rimraf from 'rimraf';
import { IFileManagerDriver } from './driver.interface';

// const _path = process.env['LOCAL_FS_BASEDIR'] || 'public/files';

export class LocalDriver implements IFileManagerDriver {

  private path: string;
  private public_url: string;

  constructor(public_url: string, path: string) {
    this.path = Path.join(__dirname, '../../..', path);
    this.public_url = public_url;
  }

  async putFile(path: string, file: string) {
    await this.put(path, await FS.readFile(file));
  }

  _getFullPath(path: string): string {
    return Path.join(this.path, path);
  }

  async get(path: string) {
    return await FS.readFile(this._getFullPath(path));
  }

  async put(path: string, content: string | Buffer) {

    let dir = path.split('/');
    dir.splice(-1, 1);
    let _dir = dir.join('/');

    await FS.mkdir(this._getFullPath(_dir), { recursive: true });
    await FS.writeFile(this._getFullPath(path), content);
  }

  async delete(path: string) {
    if(oFS.existsSync(this._getFullPath(path))) {
      await FS.unlink(this._getFullPath(path));
    }
  }

  url(path: string): string {
    return `${this.public_url}/files/${path}`
  }

  async purgeAll() {
    await Rimraf.sync(this._getFullPath(''));
  }
}