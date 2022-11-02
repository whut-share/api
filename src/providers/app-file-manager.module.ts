import { Endpoint, S3 } from "aws-sdk";
import { AWSDriver, FileManagerModule, LocalDriver } from "@/libs/file-manager";

export const AppFileManagerModule = FileManagerModule.forRoot(() => {
  if(process.env['FILESYSTEM_DRIVER'] === 'aws') {
    return new AWSDriver(
      process.env['FILESYSTEM_URL'],
      new S3({
        accessKeyId: process.env['S3_KEY_ID'],
        secretAccessKey: process.env['S3_SECRET'],
        endpoint: new Endpoint(process.env['S3_ENDPOINT']),
      }),
      process.env['S3_BUCKET']
    );
  }

  return new LocalDriver(
    process.env['FILESYSTEM_URL'],
    'public/files'
  );
});