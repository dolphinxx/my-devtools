import {createWriteStream, unlinkSync} from 'fs-extra';
import {get} from 'request';

export function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    get(url, {followRedirect: true})
      .on('error', function (err: Error) {
        unlinkSync(dest);
        reject(err);
      }).pipe(createWriteStream(dest)).on('finish', () => resolve());
  });
}
