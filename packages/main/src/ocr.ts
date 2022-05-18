import type {ImageLike} from 'tesseract.js';
import {createWorker} from 'tesseract.js';
import * as robot from 'robotjs';
import {ensureDirSync} from 'fs-extra';
import {nativeImage} from 'electron';
import {fileTypeFromBuffer} from 'file-type';

export async function recognizeText(options:{rect?:Rectangle, image?: ArrayBuffer, lang?: string}, langDir: string) {
  let image:ImageLike|undefined;
  if(options.rect) {
    // recognize rectangle on screen
    const bitmap = robot.screen.capture(options.rect.x, options.rect.y, options.rect.width, options.rect.height);
    image = nativeImage.createFromBuffer(bitmap.image, {width: bitmap.width, height: bitmap.height}).toPNG();
  } else if(options.image){
    image = Buffer.from(options.image);
  }
  if(!image) {
    console.warn('recognize text: no image');
    return;
  }

  ensureDirSync(langDir);
  const lang = options.lang||'eng';
  // const langPath = path.join(langDir, `${lang}.traineddata`);
  // if(!existsSync(langPath)) {
  //   const tmp = path.join(app.getPath('temp'), `tessdata-${lang}-${Date.now()}.tmp`);
  //   await downloadFile(`https://github.com/tesseract-ocr/tessdata/raw/4.00/${lang}.traineddata`, tmp);
  //   if(statSync(tmp).size === 0) {
  //     console.error('Download lang data failed: empty file!');
  //     throw new Error('Download lang data failed: empty file!');
  //   }
  //   moveSync(tmp, langPath);
  //   removeSync(tmp);
  // }
  const worker = createWorker({
    langPath: langDir,
    cachePath: langDir,
    gzip: false,
  });
  await worker.load();
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
  const result = await worker.recognize(image);
  await worker.terminate();
  const fileType = await fileTypeFromBuffer(image as Buffer);
  return {result, image: `data:${fileType?.mime};base64,${image.toString('base64')}`};
}
