import * as FS from 'fs';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { IFileManagerDriver } from './driver.interface';

// const bucket_name = process.env['S3_BUCKET'];

export class AWSDriver implements IFileManagerDriver {

  s3: S3;
  bucket_name: string;
  public_url: string;

  constructor(
    public_url: string,
    s3: S3, 
    bucket_name: string, 
  ) {
    this.s3 = s3;
    this.bucket_name = bucket_name;
    this.public_url = public_url;
  }

  async putFile(path: string, file: string) {
    await this.put(path, FS.readFileSync(file));
  }

  async get(path: string) {
    return await this.s3.getObject({
      Bucket: this.bucket_name,
      Key: path,
    }).promise().then(res => Buffer.from(res.Body.toString(), 'utf8'));
  }

  async put(path: string, content: string | Buffer) {
    await this.s3.putObject({
      Bucket: this.bucket_name,
      Key: path,
      Body: content,
      ACL: 'public-read',
    }).promise();
  }

  async delete(path: string) {
    await this.s3.deleteObject({
      Bucket: this.bucket_name,
      Key: path,
    }).promise();
  }

  url(path: string) {

    path = path.replace(/^\//, '');

    const endpoint = this.s3.endpoint.host;
    
    return this.public_url
      .replace('{BUCKET}', this.bucket_name)
      .replace('{ENDPOINT}', endpoint)
      .replace('{PATH}', path);
  }
}