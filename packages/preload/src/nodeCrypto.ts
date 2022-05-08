import type {BinaryLike} from 'crypto';
import {createHash} from 'crypto';
import {exposeInMainWorld} from './exposeInMainWorld';
import {fileTypeFromBuffer} from 'file-type';

function sha1(data: BinaryLike) {
  return createHash('sha1')
    .update(data)
    .digest('hex');
}

function sha256(data: BinaryLike) {
  return createHash('sha256')
    .update(data)
    .digest('hex');
}

function sha512(data: BinaryLike) {
  return createHash('sha512')
    .update(data)
    .digest('hex');
}

function md5(data: BinaryLike) {
  return createHash('md5')
    .update(data)
    .digest('hex');
}

async function base64url(data: ArrayBuffer): Promise<string> {
  const fileType = await fileTypeFromBuffer(data);
  const str = new Buffer(data).toString('base64');
  if (fileType && fileType.mime) {
    return `data:${fileType.mime};base64,${str}`;
  }
  return str;
}

// Export for types in contracts.d.ts
export const nodeCrypto = {sha1, sha256, sha512, md5, base64url} as const;

exposeInMainWorld('nodeCrypto', nodeCrypto);
